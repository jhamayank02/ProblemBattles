package controllers

import (
	db "AuthService/db/repositories"
	"AuthService/dto"
	"AuthService/services"
	"AuthService/utils"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

var (
	ErrInvalidRoleId = errors.New("invalid user id")
)

type RoleController struct {
	RoleService services.RoleService
}

func NewRoleController(_roleService services.RoleService) *RoleController {
	return &RoleController{
		RoleService: _roleService,
	}
}

func (c *RoleController) Create(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.CreateRoleDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}
	role, err := c.RoleService.CreateRole(r.Context(), payloadValue.Name, payloadValue.Description)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role created successfully", role)
}

func (c *RoleController) UpdateRole(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.UpdateRoleDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}
	roleId := chi.URLParam(r, "id")
	roleIdInt, err := strconv.Atoi(roleId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid role id")
		return
	}
	role, err := c.RoleService.UpdateRole(r.Context(), roleIdInt, payloadValue.Name, payloadValue.Description)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role updated successfully", role)
}

func (c *RoleController) GetById(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	roleIdInt, err := strconv.Atoi(roleId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid role id")
		return
	}

	role, err := c.RoleService.GetRoleById(r.Context(), roleIdInt)
	if err != nil {
		if errors.Is(err, db.ErrRoleNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrRoleNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role fetched successfully", role)
}

func (c *RoleController) GetByName(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	query = strings.TrimSpace(query)
	if query == "" {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid query")
		return
	}

	role, err := c.RoleService.GetRoleByName(r.Context(), query)
	if err != nil {
		if errors.Is(err, db.ErrRoleNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrRoleNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role fetched successfully", role)
}

func (c *RoleController) GetAllRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := c.RoleService.GetAllRoles(r.Context())
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (c *RoleController) GetRolePermissions(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	roleIdInt, err := strconv.Atoi(roleId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid role id")
		return
	}

	role, err := c.RoleService.GetRolePermissions(r.Context(), roleIdInt)
	if err != nil {
		if errors.Is(err, db.ErrRoleNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrRoleNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role permissions fetched successfully", role)
}

func (c *RoleController) GetAllRolePermissions(w http.ResponseWriter, r *http.Request) {
	roles, err := c.RoleService.GetAllRoles(r.Context())
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Roles permissions fetched successfully", roles)
}

func (c *RoleController) AssignRole(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid user id")
		return
	}

	roleId := chi.URLParam(r, "roleId")
	roleIdInt, err := strconv.Atoi(roleId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid role id")
		return
	}

	_, err = c.RoleService.AssignRole(r.Context(), userIdInt, roleIdInt)
	if err != nil {
		if errors.Is(err, db.ErrRoleNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrRoleNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role assigned successfully", nil)
}

func (c *RoleController) RemoveRole(w http.ResponseWriter, r *http.Request) {
	userRoleId := chi.URLParam(r, "userRoleId")
	userRoleIdInt, err := strconv.Atoi(userRoleId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid user role id")
		return
	}

	_, err = c.RoleService.RemoveRole(r.Context(), userRoleIdInt)
	if err != nil {
		if errors.Is(err, db.ErrRoleNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrRoleNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Role removed successfully", nil)
}
