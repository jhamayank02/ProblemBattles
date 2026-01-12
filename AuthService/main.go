package main

import (
	"AuthService/app"
	"AuthService/services"
)

func main() {
	cfg := app.NewConfig()
	application := app.NewApplication(cfg)

	redisClient := services.RedisConn()
	go services.StartEvaluationWorker(redisClient)

	application.Run()
}
