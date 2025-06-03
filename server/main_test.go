package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

func setupTestFiles(t *testing.T) func() {
	if err := os.MkdirAll("static", 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile("static/index.html", []byte("<html>{{.CurrentQueries}}</html>"), 0o644); err != nil {
		t.Fatal(err)
	}
	return func() {
		os.RemoveAll("static")
		// reset once for tests
		indexOnce = sync.Once{}
		liveOnce = sync.Once{}
		indexTemplate = nil
		liveTemplate = nil
	}
}

func TestRenderTemplateCaching(t *testing.T) {
	cleanup := setupTestFiles(t)
	defer cleanup()

	req := httptest.NewRequest(http.MethodGet, "/active/", nil)
	rr := httptest.NewRecorder()
	renderTemplate(rr, req)

	etag := rr.Header().Get("ETag")
	if etag == "" {
		t.Fatal("etag header missing")
	}
	if lm := rr.Header().Get("Last-Modified"); lm != indexModTime.UTC().Format(http.TimeFormat) {
		t.Errorf("unexpected Last-Modified header: %s", lm)
	}
	if cc := rr.Header().Get("Cache-Control"); cc != "no-cache" {
		t.Errorf("unexpected Cache-Control header: %s", cc)
	}

	req2 := httptest.NewRequest(http.MethodGet, "/active/", nil)
	req2.Header.Set("If-None-Match", etag)
	rr2 := httptest.NewRecorder()
	renderTemplate(rr2, req2)

	if rr2.Code != http.StatusNotModified {
		t.Fatalf("expected 304, got %d", rr2.Code)
	}
}

func TestHandleStaticFilesCacheControl(t *testing.T) {
	cleanup := setupTestFiles(t)
	defer cleanup()

	os.WriteFile(filepath.Join("static", "file.js"), []byte("1"), 0o644)
	handler := handleStaticFiles(http.FileServer(http.Dir("static")))

	req := httptest.NewRequest(http.MethodGet, "/file.js", nil)
	rr := httptest.NewRecorder()
	handler(rr, req)
	if !strings.Contains(rr.Header().Get("Cache-Control"), "max-age") {
		t.Error("expected caching headers for static files")
	}

	req2 := httptest.NewRequest(http.MethodGet, "/config/settings.json", nil)
	rr2 := httptest.NewRecorder()
	handler(rr2, req2)
	if cc := rr2.Header().Get("Cache-Control"); cc != "no-cache" {
		t.Errorf("expected no-cache for config files, got %s", cc)
	}
}
