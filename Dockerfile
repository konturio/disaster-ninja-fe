FROM golang:1.19-alpine3.16
WORKDIR /usr/src/app
# ENTRYPOINT ["tail", "-f", "/dev/null"]

COPY ./server/. ./
COPY ./dist/. ./static/
RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 80
CMD ["app"]
