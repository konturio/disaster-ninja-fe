FROM golang:1.20.2-alpine3.16
WORKDIR /usr/src/app

COPY ./server/go.mod ./server/go.sum ./
RUN go mod download && go mod verify

COPY ./server/. ./
COPY ./dist/. ./static/
RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 80
CMD ["app"]
