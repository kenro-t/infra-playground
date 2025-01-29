package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Response struct {
	Message string `json:"message"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{
		Message: "hello",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Println("Error encoding JSON:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func main() {
	http.HandleFunc("/", helloHandler)
	log.Println("Server is starting on port 80...")
	if err := http.ListenAndServe(":80", nil); err != nil {
		log.Fatal("Error starting server:", err)
	}
}

// 疎通確認したコマンド
// curl -i http://docker-playground_devcontainer-mock-1:80