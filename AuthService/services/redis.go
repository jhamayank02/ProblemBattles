package services

import (
	config "AuthService/config/env"
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type EvaluatedSubmission struct {
	Status       string `json="status,omitempty"`
	SubmissionId string `json="submissionId,omitempty"`
	ProblemId    string `json="problemId,omitempty"`
	UserId       string `json="userId,omitempty"`
}

func RedisConn() *redis.Client {
	conn := redis.NewClient(&redis.Options{
		Addr: config.GetString("REDIS_URL", "localhost:6379"),
	})

	if err := conn.Ping(context.Background()).Err(); err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  fmt.Sprintf("Error in redis connection: %s", err),
			"type": "redis_error",
		}).Error("Redis Error")
	} else {
		logrus.WithFields(logrus.Fields{
			"messsage": fmt.Sprintf("Redis connected successfully"),
			"type":     "redis_connected",
		}).Info("Redis Connected Successfully")
	}

	return conn
}

func StartEvaluationWorker(conn *redis.Client) {
	ctx := context.Background()

	sub := conn.Subscribe(ctx, "evaluated")
	defer sub.Close()

	for msg := range sub.Channel() {
		var payload EvaluatedSubmission
		err := json.Unmarshal([]byte(msg.Payload), &payload)
		if err != nil {
			logrus.Error("failed to read evaluated job data:", err)
			continue
		}

		logrus.Info("Evaluated job payload:", payload)

		data, err := json.Marshal(payload)
		if err != nil {
			logrus.WithError(err).Error("Failed to marshal websocket payload")
			continue
		}
		userIdInt, err := strconv.Atoi(payload.UserId)
		if err == nil {
			SendToUser(userIdInt, data)
		}
	}
}
