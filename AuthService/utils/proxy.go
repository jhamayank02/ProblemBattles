package utils

import (
	"AuthService/dto"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"

	"github.com/sirupsen/logrus"
)

// Custom context key types to avoid collisions
// type contextKey string

// const (
// 	UserIDKey contextKey = "userId"
// )

func ProxyToService(targetBaseUrl string, pathPrefix string) http.HandlerFunc {
	target, err := url.Parse(targetBaseUrl)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  fmt.Sprintf("Error parsing target url: %s", targetBaseUrl),
			"type": "proxy_error",
		}).Error("Proxy Error")
		return func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "Bad Gateway", http.StatusBadGateway)
		}
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	proxy.Director = func(r *http.Request) {
		// Get the original path
		originalPath := r.URL.Path

		logrus.WithFields(logrus.Fields{
			"original_path": originalPath,
			"path_prefix":   pathPrefix,
			"target_host":   target.Host,
		}).Info("Proxying request")

		// Set the target
		r.URL.Scheme = target.Scheme
		r.URL.Host = target.Host
		r.URL.Path = originalPath
		r.Host = target.Host

		// Add user ID header
		// payload := r.Context().Value("payload")
		// payloadValue, ok := payload.(dto.UserIdDTO)
		userIdDTO, ok := r.Context().Value(UserIDKey).(dto.UserIdDTO)
		if !ok {
			// Handle the case where the value is missing or wrong type
			logrus.WithFields(logrus.Fields{
				"err":  fmt.Sprintf("Error in request proxy: userId not found in the context"),
				"type": "proxy_error",
			}).Error("Proxy Error")
		}

		if ok {
			r.Header.Set("X-User-ID", strconv.Itoa(userIdDTO.UserId))
		}
	}

	return proxy.ServeHTTP
}
