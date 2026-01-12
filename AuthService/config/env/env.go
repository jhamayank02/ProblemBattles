package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// Loads env variable from .env to process's environment
func Load() {
	err := godotenv.Load(".env")
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  fmt.Sprintf("Error loading .env file, exiting the program:", err),
			"type": "env_init_err",
		}).Error("Error loading .env file")
		os.Exit(1)
	}
}

func GetString(key string, fallback string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	return value
}

func GetInt(key string, fallback int) int {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}

	valueInt, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return valueInt
}

func GetBool(key string, fallback bool) bool {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}

	valueBool, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}

	return valueBool
}
