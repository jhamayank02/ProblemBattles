package app

import (
	dbConfig "AuthService/config/db"
	config "AuthService/config/env"
	"AuthService/controllers"
	repo "AuthService/db/repositories"
	"AuthService/router"
	"AuthService/services"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/sirupsen/logrus"
)

// Server config
type Config struct {
	Addr              string // PORT
	JwtSecret         string
	ProblemService    string
	SubmissionService string
}

// Constructor for config
func NewConfig() Config {
	addr := config.GetString("PORT", ":3004")
	jwtSecret := config.GetString("JWT_SECRET", "secret-key")
	problemService := config.GetString("PROBLEM_SERVICE", "http://localhost:3000")
	submissionService := config.GetString("SUBMISSION_SERVICE", "http://localhost:3002")

	return Config{
		Addr:              addr,
		JwtSecret:         jwtSecret,
		ProblemService:    problemService,
		SubmissionService: submissionService,
	}
}

// Server details
type Application struct {
	Config Config
	Store  repo.Storage
}

// Constructor for application
func NewApplication(cfg Config) Application {
	return Application{
		Config: cfg,
		Store:  *repo.NewStorage(),
	}
}

// Logger setup
func init() {
	logFile, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		logrus.Fatalf("error opening file: %v", err)
	}

	// write in file and stdout
	multiWriter := io.MultiWriter(os.Stdout, logFile)

	// use JSON format
	logrus.SetFormatter(&logrus.JSONFormatter{})

	logrus.SetOutput(multiWriter)
}

// Member function of application struct
func (a *Application) Run() error {

	// Load the env variables
	config.Load()

	// Initialize DB
	dbConn, err := dbConfig.SetupDBConn()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  err,
			"type": "db_error",
		}).Error("DB Error")
		os.Exit(1)
	}

	role_permission_repo := repo.NewRolePermissionRepository(dbConn)
	user_role_repo := repo.NewUserRoleRepository(dbConn)

	role_repo := repo.NewRoleRepository(dbConn)
	role_service := services.NewRoleService(role_repo, role_permission_repo, user_role_repo)
	role_controller := controllers.NewRoleController(role_service)
	role_router := router.NewRoleRouter(*role_controller)

	user_repo := repo.NewUserRepository(dbConn)
	user_service := services.NewUserService(user_repo)
	user_controller := controllers.NewUserController(user_service, role_service)
	user_router := router.NewUserRouter(*user_controller)

	server := &http.Server{
		Addr:         a.Config.Addr,
		Handler:      router.SetupRouter(user_router, role_router),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	logrus.WithFields(logrus.Fields{
		"msg":  fmt.Sprint("Starting server on port ", a.Config.Addr),
		"type": "info",
	}).Info("Server started successfully")

	return server.ListenAndServe()
}
