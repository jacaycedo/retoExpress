const WebSocket = require("ws");
const fs = require('fs')
const Mensaje = require('./models/mensaje')
const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      x = JSON.parse(message);
      Mensaje.create( { Message: x.Message, author:x.author, ts:x.ts }).then((result)=>{
        console.log(result)
    });
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;