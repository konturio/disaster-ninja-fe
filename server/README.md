# Disaster Ninja Go Server

This lightweight Go server serves the front-end static files and provides metrics via Prometheus. It now caches the main HTML templates in memory and adds standard HTTP caching headers to improve performance.

## Caching Behavior

- `index.html` and `live/index.html` are read and parsed once on first request.
- Each template response includes `ETag` and `Last-Modified` headers. A matching `If-None-Match` request header returns **304 Not Modified**.
- Static files under `/static` are served with `Cache-Control: public, max-age=31536000, immutable`, except files under `/config/` which are served with `Cache-Control: no-cache`.

Run tests with `go test ./...` inside the `server` directory.
