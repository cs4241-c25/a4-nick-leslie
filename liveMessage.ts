import { Router } from "express";
import { MongoClient } from "mongodb";
import { Express } from "express";
import { Server, WebSocketServer} from "ws"
import { createServer } from 'node:http'; // Import createServer

type Protocol = "FIRST_CONNECT" | "SEND_MSG" | "RECV_MSG"

type message = {
  protocal: Protocol
  userID:string
  targetId:string
  message:string
}
//this is an idea that im gonna abandon for time
export  function setUpWebSockets(app:Express) {
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection',(ws,req) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Server received: ${message}`); // Echo back to client

      // Broadcast the message to all connected clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`User: ${message}`); // Add "User: " prefix
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', error => {
      console.error('WebSocket error:', error);
    });
  });

  return server;
}
