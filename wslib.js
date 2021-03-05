const WebSocket = require("ws");
const fs = require('fs')

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
      fs.readFile("./mensajesHistoricos.json", function (err, data) {
        var json = JSON.parse(data);
        json.push(x);    
        fs.writeFile("./mensajesHistoricos.json", JSON.stringify(json), function(err){
          if (err) throw err;
        });
    })

      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;