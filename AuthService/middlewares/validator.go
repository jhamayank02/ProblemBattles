package middlewares

import (
	"AuthService/dto"
	"AuthService/utils"
	"context"
	"net/http"
)

func UserLoginRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.LoginUserDTO

		// Read and decode the JSON body into the payload
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
			return
		}

		// Validate the payload using the validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err.Error())
			return
		}

		req_context := r.Context()
		ctx := context.WithValue(req_context, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserRegisterRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.CreateUserDTO

		// Read and decode the JSON body into the payload
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
			return
		}

		// Validate the payload using the validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err.Error())
			return
		}

		req_context := r.Context()
		ctx := context.WithValue(req_context, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RoleCreateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.CreateRoleDTO

		// Read and decode the JSON body into the payload
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
			return
		}

		// Validate the payload using the validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			// errs := err.(validator.ValidationErrors)
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err.Error())
			return
		}

		req_context := r.Context()
		ctx := context.WithValue(req_context, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RoleUpdateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.UpdateRoleDTO

		// Read and decode the JSON body into the payload
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err.Error())
			return
		}

		// Validate the payload using the validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err.Error())
			return
		}

		req_context := r.Context()
		ctx := context.WithValue(req_context, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
