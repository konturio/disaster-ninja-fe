# Build stage
FROM golang:1.20.2-alpine3.16 AS builder
WORKDIR /usr/src/app

COPY ./server/go.mod ./server/go.sum ./
RUN go mod download && go mod verify

COPY ./server/. ./
RUN CGO_ENABLED=0 go build -v -ldflags="-s -w" -o app .

# Runtime stage
FROM alpine:3.16
RUN apk --no-cache add ca-certificates=20240226-r0 \
    && adduser -D appuser
WORKDIR /home/appuser
COPY --from=builder /usr/src/app/app .
COPY ./dist/. ./static/
ENV PORT=8080
EXPOSE 8080
USER appuser
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1
CMD ["./app"]
