package utils

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var Validator *validator.Validate

func init() {
	Validator = NewValidator()
}

func NewValidator() *validator.Validate {
	return validator.New(validator.WithRequiredStructEnabled())
}

func WriteJsonResponse(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func ReadJsonBody(r *http.Request, result any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(result)
}

func WriteSuccessResponse(w http.ResponseWriter, status int, message string, data any) error {
	response := map[string]any{}
	response["status"] = "success"
	response["message"] = message
	response["data"] = data
	return WriteJsonResponse(w, status, response)
}

func WriteErrorResponse(w http.ResponseWriter, status int, message string, err any) error {
	response := map[string]any{}
	response["status"] = "failed"
	response["message"] = message
	response["error"] = err
	return WriteJsonResponse(w, status, response)
}
