package router

import (
	"AuthService/controllers"
	"AuthService/middlewares"

	"github.com/go-chi/chi/v5"
)

type RoleRouter struct {
	RoleController controllers.RoleController
}

func NewRoleRouter(_roleController controllers.RoleController) Router {
	return &RoleRouter{
		RoleController: _roleController,
	}
}

func (r *RoleRouter) Register(router chi.Router) {
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin"), middlewares.RoleCreateRequestValidator).Post("/", r.RoleController.Create)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin"), middlewares.RoleUpdateRequestValidator).Put("/{id}", r.RoleController.UpdateRole)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/{id}", r.RoleController.GetById)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/roles", r.RoleController.GetAllRoles)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/name", r.RoleController.GetByName)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/permissions", r.RoleController.GetAllRolePermissions)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Get("/permissions/{id}", r.RoleController.GetRolePermissions)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Post("/assign/{userId}/{roleId}", r.RoleController.AssignRole)
	router.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Delete("/remove/{userRoleId}", r.RoleController.RemoveRole)
}
