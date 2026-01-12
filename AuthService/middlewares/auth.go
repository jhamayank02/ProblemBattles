package middlewares

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	dbConfig "AuthService/config/db"
	env "AuthService/config/env"
	db "AuthService/db/repositories"
	"AuthService/dto"
	"AuthService/models"
	"AuthService/utils"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt"
)

func JWTAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			cookie, err := r.Cookie("access_token")
			if err != nil || cookie == nil {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Authorization header is required")
				return
			}
			authHeader = cookie.Value
		}
		// if !strings.HasPrefix(authHeader, "Bearer ") {
		// 	utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Authorization header must start with Bearer")
		// 	return
		// }
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Token is required")
			return
		}
		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(env.GetString("SECRET_KEY", "TOKEN")), nil
		})
		if err != nil {
			// http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
			utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Invalid token")
			return
		}
		userId, okId := claims["id"].(float64)
		email, okEmail := claims["email"].(string)
		if !okId || !okEmail {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Invalid token")
			return
		}
		ctx := context.WithValue(r.Context(), utils.UserIDKey, dto.UserIdDTO{UserId: int(userId)})
		ctx = context.WithValue(ctx, utils.EmailKey, email)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RequireAllRoles(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIdPayload := r.Context().Value(utils.UserIDKey)
			userIdDto, ok := userIdPayload.(dto.UserIdDTO)
			if !ok {
				utils.WriteErrorResponse(w, 401, "Unauthorized", "Invalid user context")
				return
			}
			userId := userIdDto.UserId

			dbConn := dbConfig.DB

			user_role_repo := db.NewUserRoleRepository(dbConn)

			hasAllRoles, hasAllRolesErr := user_role_repo.HasAllRoles(r.Context(), userId, roles)
			if hasAllRolesErr != nil {
				// http.Error(w, "Error checking user roles: "+hasAllRolesErr.Error(), http.StatusInternalServerError)
				utils.WriteErrorResponse(w, http.StatusInternalServerError, "You are not authorized to access this route", db.ErrInternalServerError.Error())
				return
			}

			if !hasAllRoles {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Forbidden: You do not have the required roles")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RequireAnyRole(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIdPayload := r.Context().Value(utils.UserIDKey)
			userIdDto, ok := userIdPayload.(dto.UserIdDTO)
			if !ok {
				utils.WriteErrorResponse(w, 401, "Unauthorized", "Invalid user context")
				return
			}
			userId := userIdDto.UserId

			dbConn := dbConfig.DB

			urr := db.NewUserRoleRepository(dbConn)

			hasAnyRole, hasAnyRolesErr := urr.HasAnyRole(r.Context(), userId, roles)
			if hasAnyRolesErr != nil {
				// http.Error(w, "Error checking user roles: "+hasAnyRolesErr.Error(), http.StatusInternalServerError)
				utils.WriteErrorResponse(w, http.StatusInternalServerError, "You are not authorized to access this route", db.ErrInternalServerError.Error())
				return
			}

			if !hasAnyRole {
				utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Forbidden: You do not have the required roles")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func containsRole(roles []*models.Role, role string) bool {
	for _, r := range roles {
		if strings.EqualFold(role, r.Name) {
			return true
		}
	}
	return false
}

func RequireSelfOrAdmin() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			userIdPayload := r.Context().Value(utils.UserIDKey)
			userIdDto, ok := userIdPayload.(dto.UserIdDTO)
			if !ok {
				utils.WriteErrorResponse(w, 401, "Unauthorized", "Invalid user context")
				return
			}
			userId := userIdDto.UserId

			urr := db.NewUserRoleRepository(dbConfig.DB)
			roles, err := urr.GetUserRoles(r.Context(), int64(userId))
			if err != nil {
				utils.WriteErrorResponse(w, http.StatusInternalServerError, "Something went wrong", db.ErrInternalServerError.Error())
				return
			}

			if containsRole(roles, "admin") {
				next.ServeHTTP(w, r)
				return
			}

			if containsRole(roles, "user") {
				requested := chi.URLParam(r, "id")
				reqId, err := strconv.Atoi(requested)
				if err != nil {
					utils.WriteErrorResponse(w, http.StatusBadRequest, "", "Invalid user id")
					return
				}

				if reqId == userId {
					next.ServeHTTP(w, r)
					return
				}
			}

			utils.WriteErrorResponse(w, http.StatusForbidden, "Forbidden", "You are not allowed to access this resource")
		})
	}
}
