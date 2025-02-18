"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpWebSockets = setUpWebSockets;
var ws_1 = require("ws");
var node_http_1 = require("node:http"); // Import createServer
//this is an idea that im gonna abandon for time
function setUpWebSockets(app) {
    var server = (0, node_http_1.createServer)(app);
    var wss = new ws_1.WebSocketServer({ server: server });
    wss.on('connection', function (ws, req) {
        console.log('Client connected');
        ws.on('message', function (message) {
            console.log("Received: ".concat(message));
            ws.send("Server received: ".concat(message)); // Echo back to client
            // Broadcast the message to all connected clients
            wss.clients.forEach(function (client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send("User: ".concat(message)); // Add "User: " prefix
                }
            });
        });
        ws.on('close', function () {
            console.log('Client disconnected');
        });
        ws.on('error', function (error) {
            console.error('WebSocket error:', error);
        });
    });
    return server;
}
