FROM golang:tip-alpine3.23

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main

EXPOSE 3004

CMD ["./main"]