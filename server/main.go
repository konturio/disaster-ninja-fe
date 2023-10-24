package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"text/template"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const (
	Host = ""
	Port = "80"
)

type TemplateVariables struct {
	CurrentQueries string
}

func renderTemplate(response http.ResponseWriter, request *http.Request) {
	templateVariables := TemplateVariables{
		CurrentQueries: request.URL.RawQuery,
	}

	parsedTemplate, _ := template.ParseFiles("./static/index.html")
	response.Header().Add("Expires", "-1")
	response.Header().Add("Cache-Control", "no-cache")
	err := parsedTemplate.Execute(response, templateVariables)

	if err != nil {
		log.Println("Error executing template:", err)
		return
	}
}

func redirectWithDn1Params(response http.ResponseWriter, request *http.Request) {
	parsedTemplate, _ := template.ParseFiles("./live/index.html")
	err := parsedTemplate.Execute(response, nil)
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
			response.Header().Add("Expires", "-1")
			response.Header().Add("Cache-Control", "no-cache")
		default:
		}

		fs.ServeHTTP(response, request)
	}
}

type FELogMessage struct {
	timestamp int
	message   string
	trace string
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
