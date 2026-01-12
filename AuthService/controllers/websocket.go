package controllers

import (
	"AuthService/dto"
	"AuthService/services"
	"AuthService/utils"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all connections
}

func WsHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Extract JWT
	// token := r.URL.Query().Get("token")
	// if token == "" {
	// 	utils.WriteErrorResponse(w, http.StatusUnauthorized, "Invalid token", "Unauthorized")
	// 	return
	// }

	// // 2. Validate JWT
	// claims := jwt.MapClaims{}
	// _, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
	// 	return []byte(env.GetString("SECRET_KEY", "TOKEN")), nil
	// })
	// if err != nil {
	// 	// http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
	// 	utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Invalid token")
	// 	return
	// }
	// userId, okId := claims["id"].(float64)
	// if !okId {
	// 	http.Error(w, "Invalid token claims", http.StatusUnauthorized)
	// 	utils.WriteErrorResponse(w, http.StatusUnauthorized, "You are not authorized to access this route", "Invalid token")
	// 	return
	// }

	userIdPayload := r.Context().Value(utils.UserIDKey)
	userIdDto, ok := userIdPayload.(dto.UserIdDTO)
	if !ok {
		utils.WriteErrorResponse(w, 401, "Unauthorized", "Invalid user context")
		return
	}
	userId := userIdDto.UserId

	// 3. Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"err":  fmt.Sprintf("Error in websocket connection: %s", err),
			"type": "websocket_error",
		}).Error("Websocket Error")
		return
	}
	logrus.WithFields(logrus.Fields{
		"messsage": fmt.Sprintf("Websocket connected"),
		"type":     "websocket_connection",
	}).Info("Websocket Connected")

	// 4. Register connection
	services.RegisterConnection(userId, ws)
	defer services.UnregisterConnection(userId, ws)

	// Message to send
	// msg := []byte("Welcome to the WebSocket server!")

	// // Send the message as a TextMessage
	// err = ws.WriteMessage(websocket.TextMessage, msg)
	// if err != nil {
	// 	logrus.WithFields(logrus.Fields{
	// 		"err":  fmt.Sprintf("Error in websocket message sending: %s", err),
	// 		"type": "websocket_message_send_error",
	// 	}).Error("Websocket Error")
	// 	return
	// }

	// 5. Keep connection open (do nothing)
	for {
		// Read messages from browser
		_, msg, err := ws.ReadMessage()
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"err":  fmt.Sprintf("Websocket message received: %s", msg),
				"type": "websocket_message_received",
			}).Error("Websocket Error")
			ws.Close()
			return
		}
		logrus.WithFields(logrus.Fields{
			"messsage": fmt.Sprintf("Error in websocket message read: %s", err),
			"type":     "websocket_message_read_error",
		}).Info("Websocket Message Received")
	}
}

// func sendMessage(conn *websocket.Conn, messageType int, data []byte) error {
// 	err := conn.WriteMessage(messageType, data)
// 	if err != nil {
// 		log.Println("Error sending message:", err)
// 		return err
// 	}
// 	log.Println("Message sent successfully")
// 	return nil
// }
