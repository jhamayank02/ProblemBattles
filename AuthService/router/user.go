package router

import (
	"AuthService/controllers"
	"AuthService/middlewares"

	"github.com/go-chi/chi/v5"
)

type UserRouter struct {
	UserController controllers.UserController
}

func NewUserRouter(_userController controllers.UserController) Router {
	return &UserRouter{
		UserController: _userController,
	}
}

func (r *UserRouter) Register(router chi.Router) {
	router.With(middlewares.UserRegisterRequestValidator).Post("/signup", r.UserController.Create)
	router.With(middlewares.UserLoginRequestValidator).Post("/signin", r.UserController.LoginUser)
	router.With(middlewares.JWTAuthMiddleware).Get("/validate-session", r.UserController.ValidateUserSession)
	router.With(middlewares.JWTAuthMiddleware).Get("/logout", r.UserController.LogoutUser)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireSelfOrAdmin()).Get("/user/{id}", r.UserController.GetById)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/users", r.UserController.GetAll)
}
