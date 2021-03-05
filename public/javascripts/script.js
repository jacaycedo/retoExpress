const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>Autor: ${JSON.parse(item)['author']}. Mensaje: ${JSON.parse(item)['Message']}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const autor = document.getElementById("autor");
  var x = {"author": autor.value, "Message" : message.value}
  ws.send(JSON.stringify(x));
  message.value = "";
  autor.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);