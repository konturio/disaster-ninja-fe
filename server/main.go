package main

import (
	"log"
	"net/http"
	"text/template"
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

func handleStaticFiles(fs http.Handler) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		switch url := request.URL.Path; url {
		case "/config/":
			response.Header().Add("Expires", "-1")
			response.Header().Add("Cache-Control", "no-cache")
		default:
		}

		fs.ServeHTTP(response, request)
	}
}

func redirect(response http.ResponseWriter, request *http.Request) {
	http.Redirect(response, request, "/active/", 301)
}

func main() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/active", http.StripPrefix("/active", http.HandlerFunc(redirect)))
	http.Handle("/active/", http.StripPrefix("/active/", http.HandlerFunc(renderTemplate)))
	http.Handle("/active/static/", http.StripPrefix("/active/static", http.HandlerFunc(handleStaticFiles(fs))))

	log.Println("Server listening:", "http://"+Host+":"+Port)
	err := http.ListenAndServe(Host+":"+Port, nil)
	if err != nil {
		log.Fatal("Error Starting the HTTP Server :", err)
		return
	}
}
