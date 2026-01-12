package services

import (
	"sync"

	"github.com/gorilla/websocket"
)

var (
	userConnections = make(map[int]map[*websocket.Conn]bool)
	userConnMu      sync.RWMutex
)

func RegisterConnection(userId int, conn *websocket.Conn) {
	userConnMu.Lock()
	defer userConnMu.Unlock()

	if _, exists := userConnections[userId]; !exists {
		userConnections[userId] = make(map[*websocket.Conn]bool)
	}
	userConnections[userId][conn] = true
}

func UnregisterConnection(userId int, conn *websocket.Conn) {
	userConnMu.Lock()
	defer userConnMu.Unlock()

	if conns, exists := userConnections[userId]; exists {
		delete(conns, conn)
		if len(conns) == 0 {
			delete(userConnections, userId)
		}
	}

	conn.Close()
}

func SendToUser(userId int, message []byte) {
	userConnMu.RLock()
	defer userConnMu.RUnlock()

	conns, exists := userConnections[userId]
	if !exists {
		return
	}

	for conn := range conns {
		err := conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			conn.Close()
			delete(conns, conn)
		}
	}
}
