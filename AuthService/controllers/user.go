package controllers

import (
	db "AuthService/db/repositories"
	"AuthService/dto"
	"AuthService/services"
	"AuthService/utils"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

var (
	ErrInvalidUserId = errors.New("invalid user id")
)

type UserController struct {
	UserService services.UserService
	RoleService services.RoleService
}

func NewUserController(_userService services.UserService, _roleService services.RoleService) *UserController {
	return &UserController{
		UserService: _userService,
		RoleService: _roleService,
	}
}

func (c *UserController) GetById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "id")
	_, err := strconv.Atoi(userId)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid user id")
		return
	}

	user, err := c.UserService.GetById(r.Context(), userId)
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "User fetched successfully", user)
}

func (c *UserController) GetByEmail(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.UserEmailDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}

	user, err := c.UserService.GetByEmail(r.Context(), payloadValue.Email)
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "User fetched successfully", user)
}

func (c *UserController) Create(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.CreateUserDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}
	user, err := c.UserService.Create(r.Context(), payloadValue.Username, payloadValue.Email, payloadValue.Password)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "User created successfully", user)
}

func (c *UserController) GetAll(w http.ResponseWriter, r *http.Request) {
	users, err := c.UserService.GetAll(r.Context())
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "Users fetched successfully", users)
}

func (c *UserController) DeleteById(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.UserIdDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}

	_, err := c.UserService.DeleteById(r.Context(), string(payloadValue.UserId))
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	utils.WriteSuccessResponse(w, http.StatusOK, "User deleted successfully", nil)
}

func (c *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload")
	payloadValue, ok := payload.(dto.LoginUserDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid request payload")
		return
	}

	token, err := c.UserService.LoginUser(r.Context(), payloadValue.Email, payloadValue.Password)
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		if errors.Is(err, services.ErrInvalidCredentials) {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "", services.ErrInvalidCredentials.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	user, err := c.UserService.GetByEmail(r.Context(), payloadValue.Email)
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}
	user.Password = ""

	roles, err := c.RoleService.GetUserRoles(r.Context(), user.Id)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	var modifiedRoles []string
	for _, item := range roles {
		modifiedRoles = append(modifiedRoles, item.Name)
	}

	response := map[string]any{
		"user":  user,
		"roles": modifiedRoles,
		"token": token,
	}

	cookie := &http.Cookie{
		Name:     "access_token",
		Value:    token,
		HttpOnly: true,
		// Secure: true,
		Path:    "/",
		Expires: time.Now().Add(24 * time.Hour),
		// SameSite: http.SameSiteLax,
	}
	http.SetCookie(w, cookie)

	utils.WriteSuccessResponse(w, http.StatusOK, "User logged in successfully", response)
}

func (c *UserController) LogoutUser(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		HttpOnly: true,
		// Secure: true,
		Path:    "/",
		MaxAge:  -1,
		Expires: time.Now().Add(-(24 * time.Hour)),
		// SameSite: http.SameSiteLax,
	}
	http.SetCookie(w, cookie)

	utils.WriteSuccessResponse(w, http.StatusOK, "User logged out successfully", nil)
}

func (c *UserController) ValidateUserSession(w http.ResponseWriter, r *http.Request) {
	userDTO, ok := r.Context().Value(utils.UserIDKey).(dto.UserIdDTO)
	if !ok {
		utils.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", "You are not authorized to access this route")
		return
	}

	userID := strconv.Itoa(userDTO.UserId)

	user, err := c.UserService.GetById(r.Context(), userID)
	if err != nil {
		if errors.Is(err, db.ErrUserNotFound) {
			utils.WriteErrorResponse(w, http.StatusNotFound, "", db.ErrUserNotFound.Error())
			return
		}
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}
	user.Password = ""

	roles, err := c.RoleService.GetUserRoles(r.Context(), user.Id)
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	var modifiedRoles []string
	for _, item := range roles {
		modifiedRoles = append(modifiedRoles, item.Name)
	}

	token, err := c.UserService.ValidateUserSession(r.Context(), user.Email, int(user.Id))
	if err != nil {
		utils.WriteErrorResponse(w, http.StatusInternalServerError, "", db.ErrInternalServerError.Error())
		return
	}

	response := map[string]any{
		"user":  user,
		"roles": modifiedRoles,
		"token": token,
	}

	cookie := &http.Cookie{
		Name:     "access_token",
		Value:    token,
		HttpOnly: true,
		// Secure: true,
		Path:    "/",
		Expires: time.Now().Add(24 * time.Hour),
		// SameSite: http.SameSiteLax,
	}
	http.SetCookie(w, cookie)

	utils.WriteSuccessResponse(w, http.StatusOK, "User session validated successfully", response)
}
