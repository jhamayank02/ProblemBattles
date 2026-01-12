package utils

import (
	env "AuthService/config/env"
	"fmt"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

// Custom context key types to avoid collisions
type contextKey string

const (
	UserIDKey contextKey = "userId"
	EmailKey  contextKey = "email"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return "", err
	}
	return string(bytes), nil
}

func CheckPassword(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func CreateJwtToken(id int, email string) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    id,
		"email": email,
	})
	tokenString, err := claims.SignedString([]byte(env.GetString("SECRET_KEY", "TOKEN")))
	if err != nil {
		fmt.Println("Token string creation error:", err)
		return "", err
	}

	return tokenString, nil
}
