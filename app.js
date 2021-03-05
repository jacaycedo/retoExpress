var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const WebSocket = require("ws");
const joi = require('joi');
var fs = require('fs');

const validateMensaje = (client) => {
    const schema = joi.object({
        Message : joi.string().min(5).required(),
        author : joi.string().pattern(new RegExp('([A-zÀ-ú])\\s([A-zÀ-ú])')).required(),
        ts : joi.number().required()
    })
}



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const Mensaje = require('./models/mensaje')

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/chat/api/messages', (req, res) => {
    Mensaje.findAll().then((result) => {
        res.send(result);
    });
  });
  
app.get('/chat/api/messages/:msgId', (req, res) => {
    var buscado = req.params['msgId']

    Mensaje.findOne({ where: {ts: buscado} }).then((response)=>{
        if(response == null)
        {
            return res
        .status(404)
        .send("No existe un mensaje con ese ts");
        }
        res.send(response);
    });
 });

app.post('/chat/api/messages' , (req, res, next) =>
{
    const error = validateMensaje(req.body)
    if (error) {
        return res.status(400).send(error);
      }
    const ws = new WebSocket("ws://localhost:3000")
    ws.on('open', ()=>{
        ws.send(JSON.stringify(req.body));
    })
    res.send("Mensaje creado")
    
})

app.put('/chat/api/messages/' , (req, res) =>
{
    let newData = req.body;
    var buscado = newData['ts']
    const error = validateMensaje(req.body)
    if (error) {
        return res.status(400).send(error);
      }
    Mensaje.update(req.body, {where:{ts: buscado}}).then((response)=>{
        if (response[0] !== 0) res.send({ message: "mensaje actualizado " });
        else res.status(404).send({ message: "mensaje no encontrado" });
    });
    
})

app.delete('/chat/api/messages/:msgId' , (req, res) =>
{
    var buscado = req.params['msgId']
    Mensaje.destroy({
        where: {
          ts: buscado,
        },
      }).then((response) => {
        if (response === 1) res.status(204).send();
        else res.status(404).send({ message: "Client was not found" });
      });
})
  
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
