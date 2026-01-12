package config

import (
	config "AuthService/config/env"
	"database/sql"
	"fmt"

	"github.com/go-sql-driver/mysql"
	"github.com/sirupsen/logrus"
)

var DB *sql.DB

func SetupDBConn() (*sql.DB, error) {
	logrus.WithFields(logrus.Fields{
		"msg":  "Initializing db configuration",
		"type": "db_init_info",
	}).Info("Initializing db configuration...")

	var err error
	DB, err = setupDB()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  fmt.Sprintf("Error initializing db: ", err),
			"type": "db_init_error",
		}).Info("Error initializing db")
		return nil, err
	}
	if DB != nil {
		logrus.WithFields(logrus.Fields{
			"msg":  fmt.Sprintf("DB initialized with %d connections", DB.Stats().OpenConnections),
			"type": "db_init_info",
		}).Info("DB initialized successfully")
	}
	return DB, nil
}

func setupDB() (*sql.DB, error) {
	cfg := mysql.NewConfig()
	cfg.User = config.GetString("DB_USER", "root")
	cfg.Passwd = config.GetString("DB_PASSWORD", "password")
	cfg.Net = config.GetString("DB_NET", "tcp")
	cfg.Addr = config.GetString("DB_ADDR", "127.0.0.1:3306")
	cfg.DBName = config.GetString("DB_NAME", "leetcode_clone_auth_dev")

	logrus.WithFields(logrus.Fields{
		"msg":  fmt.Sprint("Connecting to db:", cfg.DBName, cfg.FormatDSN()),
		"type": "db_init_info",
	}).Info("Connecting to db")

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil || db == nil {
		logrus.WithFields(logrus.Fields{
			"msg":  fmt.Sprintf("Error connecting to db: %s", err),
			"type": "db_init_error",
		}).Error("Connecting to db error")
		return nil, fmt.Errorf("Error connecting to db: %w", err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		logrus.WithFields(logrus.Fields{
			"msg":  fmt.Sprintf("Error pinging db: %s", pingErr),
			"type": "db_init_error",
		}).Error("Connecting to db error")
		return nil, fmt.Errorf("Error pinging db: %w", pingErr)
	}

	logrus.WithFields(logrus.Fields{
		"msg":  fmt.Sprint("Connected to database successfully:", cfg.DBName),
		"type": "db_init_info",
	}).Info("Connected to db")
	return db, nil
}
