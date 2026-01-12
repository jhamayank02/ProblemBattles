package router

import (
	env "AuthService/config/env"
	"AuthService/controllers"
	"AuthService/middlewares"
	"AuthService/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router, RoleRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()

	chiRouter.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	chiRouter.Use(middlewares.RateLimitMiddleware)

	chiRouter.Route("/api/v1/auth", func(r chi.Router) {
		UserRouter.Register(r)
	})

	chiRouter.Route("/api/v1/roles", func(r chi.Router) {
		RoleRouter.Register(r)
	})

	// Problem Service
	// Problem routes
	chiRouter.With(middlewares.JWTAuthMiddleware).Route("/api/v1/problem", func(r chi.Router) {
		// GET - Anyone authenticated (user or admin)
		r.With(middlewares.RequireAnyRole("user", "admin")).Get("/*",
			utils.ProxyToService(
				env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"),
				"/api/v1/problem",
			).ServeHTTP)

		// POST - Admin only (create)
		r.With(middlewares.RequireAnyRole("admin")).Post("/*",
			utils.ProxyToService(
				env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"),
				"/api/v1/problem",
			).ServeHTTP)

		// PUT/PATCH - Admin only (update)
		r.With(middlewares.RequireAnyRole("admin")).Put("/*",
			utils.ProxyToService(
				env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"),
				"/api/v1/problem",
			).ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Patch("/*",
			utils.ProxyToService(
				env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"),
				"/api/v1/problem",
			).ServeHTTP)

		// DELETE - Admin only
		r.With(middlewares.RequireAnyRole("admin")).Delete("/*",
			utils.ProxyToService(
				env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"),
				"/api/v1/problem",
			).ServeHTTP)
	})

	// /api/v1/company → SAME PROBLEM SERVICE
	chiRouter.With(middlewares.JWTAuthMiddleware).Route("/api/v1/company", func(r chi.Router) {
		r.With(middlewares.RequireAnyRole("user", "admin")).Get("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/company").ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Post("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/company").ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Put("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/company").ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Patch("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/company").ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Delete("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/company").ServeHTTP)
	})

	// /api/v1/explanation → SAME PROBLEM SERVICE
	chiRouter.With(middlewares.JWTAuthMiddleware).Route("/api/v1/explanation", func(r chi.Router) {
		r.With(middlewares.RequireAnyRole("user", "admin")).Get("/*",
			utils.ProxyToService(env.GetString("PROBLEM_SERVICE", "http://localhost:3000/api/v1"), "/api/v1/explanation").ServeHTTP)
	})

	// Submission Service
	// Submission routes
	chiRouter.With(middlewares.JWTAuthMiddleware).Route("/api/v1/submission", func(r chi.Router) {
		// GET - Anyone authenticated (user or admin)
		r.With(middlewares.RequireAnyRole("user", "admin")).Get("/*",
			utils.ProxyToService(
				env.GetString("SUBMISSION_SERVICE", "http://localhost:3002/api/v1"),
				"/api/v1/submission",
			).ServeHTTP)

		// POST - Admin only (create)
		r.With(middlewares.RequireAnyRole("admin")).Post("/*",
			utils.ProxyToService(
				env.GetString("SUBMISSION_SERVICE", "http://localhost:3002/api/v1"),
				"/api/v1/submission",
			).ServeHTTP)

		// PUT/PATCH - Admin only (update)
		r.With(middlewares.RequireAnyRole("admin")).Put("/*",
			utils.ProxyToService(
				env.GetString("SUBMISSION_SERVICE", "http://localhost:3002/api/v1"),
				"/api/v1/submission",
			).ServeHTTP)

		r.With(middlewares.RequireAnyRole("admin")).Patch("/*",
			utils.ProxyToService(
				env.GetString("SUBMISSION_SERVICE", "http://localhost:3002/api/v1"),
				"/api/v1/submission",
			).ServeHTTP)

		// DELETE - Admin only
		r.With(middlewares.RequireAnyRole("admin")).Delete("/*",
			utils.ProxyToService(
				env.GetString("SUBMISSION_SERVICE", "http://localhost:3002/api/v1"),
				"/api/v1/submission",
			).ServeHTTP)
	})

	chiRouter.With(middlewares.JWTAuthMiddleware).Get("/ws", controllers.WsHandler)

	return chiRouter
}
