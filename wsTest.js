const WebSocket = require('ws');

// Function to connect to a WebSocket server
function connectToWebSocketServer(url) {
  // Create a new WebSocket object
  const websocket = new WebSocket(url);

  // Event listener for when the connection is established
  websocket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket server:", event);

    // You can send a message to the server after connection is open
    websocket.send("Hello from the client!");
  });

  // Event listener for when a message is received from the server
  websocket.addEventListener("message", (event) => {
    console.log("Message from server:", event.data);
  });

  // Event listener for when the connection is closed
  websocket.addEventListener("close", (event) => {
    console.log("Disconnected from WebSocket server:", event);
  });

  // Event listener for errors
  websocket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });

  // Return the WebSocket object so you can use it elsewhere
   return websocket;
}

// Example usage: Replace with your WebSocket server URL
const websocketURL = "ws://localhost:3001"; // Example URL
const websocketConnection = connectToWebSocketServer(websocketURL);

// You can send messages to the server later using:
// websocketConnection.send("Another message!");
