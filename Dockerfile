# Build stage
FROM golang:1.20.2-alpine3.16 AS builder
WORKDIR /usr/src/app

COPY ./server/go.mod ./server/go.sum ./
RUN go mod download && go mod verify

COPY ./server/. ./
RUN go build -v -o app ./...

# Runtime stage
FROM alpine:3.16
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /usr/src/app/app .
COPY ./dist/. ./static/
EXPOSE 80
CMD ["./app"]
