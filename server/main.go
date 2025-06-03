package main

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const (
	Host = ""
	Port = "80"
)

type TemplateVariables struct {
	CurrentQueries string
}

var (
	indexTemplate *template.Template
	indexOnce     sync.Once
	indexEtag     string
	indexModTime  time.Time

	liveTemplate *template.Template
	liveOnce     sync.Once
	liveEtag     string
	liveModTime  time.Time
)

func renderTemplate(response http.ResponseWriter, request *http.Request) {
	indexOnce.Do(func() {
		data, err := os.ReadFile("./static/index.html")
		if err != nil {
			log.Println("Error reading index.html:", err)
			return
		}
		t, err := template.New("index").Parse(string(data))
		if err != nil {
			log.Println("Error parsing index.html:", err)
			return
		}
		info, _ := os.Stat("./static/index.html")
		indexTemplate = t
		indexModTime = info.ModTime()
		h := sha1.Sum(data)
		indexEtag = hex.EncodeToString(h[:])
	})

	if indexTemplate == nil {
		http.Error(response, "index template not initialized", http.StatusInternalServerError)
		return
	}

	if match := request.Header.Get("If-None-Match"); match == indexEtag {
		response.WriteHeader(http.StatusNotModified)
		return
	}

	templateVariables := TemplateVariables{
		CurrentQueries: request.URL.RawQuery,
	}

	response.Header().Set("Expires", "-1")
	response.Header().Set("Cache-Control", "no-cache")
	response.Header().Set("ETag", indexEtag)
	response.Header().Set("Last-Modified", indexModTime.UTC().Format(http.TimeFormat))
	err := indexTemplate.Execute(response, templateVariables)

	if err != nil {
		log.Println("Error executing template:", err)
		return
	}
}

func redirectWithDn1Params(response http.ResponseWriter, request *http.Request) {
	liveOnce.Do(func() {
		data, err := os.ReadFile("./live/index.html")
		if err != nil {
			log.Println("Error reading live/index.html:", err)
			return
		}
		t, err := template.New("live").Parse(string(data))
		if err != nil {
			log.Println("Error parsing live/index.html:", err)
			return
		}
		info, _ := os.Stat("./live/index.html")
		liveTemplate = t
		liveModTime = info.ModTime()
		h := sha1.Sum(data)
		liveEtag = hex.EncodeToString(h[:])
	})

	if liveTemplate == nil {
		http.Error(response, "template not initialized", http.StatusInternalServerError)
		return
	}

	if match := request.Header.Get("If-None-Match"); match == liveEtag {
		response.WriteHeader(http.StatusNotModified)
		return
	}

	response.Header().Set("ETag", liveEtag)
	response.Header().Set("Last-Modified", liveModTime.UTC().Format(http.TimeFormat))
	response.Header().Set("Cache-Control", "no-cache")
	response.Header().Set("Expires", "-1")
	err := liveTemplate.Execute(response, nil)
	if err != nil {
		log.Println("Error executing live/index.html template:", err)
		return
	}
}

func handleStaticFiles(fs http.Handler) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		url := request.URL.Path
		switch {
		case strings.Contains(url, "/config/"):
			response.Header().Set("Expires", "-1")
			response.Header().Set("Cache-Control", "no-cache")
		default:
			response.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		}

		fs.ServeHTTP(response, request)
	}
}

type FELogMessage struct {
	timestamp int
	message   string
	trace     string
}

func writeLogs(response http.ResponseWriter, request *http.Request) {
	var msg FELogMessage

	err := json.NewDecoder(request.Body).Decode(&msg)
	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("[Client log]:", msg.timestamp, msg.message, msg.trace)
}

func redirect(response http.ResponseWriter, request *http.Request) {
	http.Redirect(response, request, "/active/", 301)
}

func main() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/live", http.StripPrefix("/live", http.HandlerFunc(redirectWithDn1Params)))
	http.Handle("/live/", http.StripPrefix("/live/", http.HandlerFunc(redirectWithDn1Params)))
	http.Handle("/active", http.StripPrefix("/active", http.HandlerFunc(redirect)))
	http.Handle("/active/", http.StripPrefix("/active/", http.HandlerFunc(renderTemplate)))
	http.Handle("/active/static/", http.StripPrefix("/active/static", http.HandlerFunc(handleStaticFiles(fs))))
	http.Handle("/metrics", promhttp.Handler())
	http.Handle("/active/log", http.StripPrefix("/active", http.HandlerFunc(writeLogs)))
	log.Println("Server listening:", "http://"+Host+":"+Port)
	err := http.ListenAndServe(Host+":"+Port, nil)
	if err != nil {
		log.Fatal("Error Starting the HTTP Server :", err)
		return
	}
}
