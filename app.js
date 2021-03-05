var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const WebSocket = require("ws");
const joi = require('joi');
var fs = require('fs');

const schema = joi.object({
    Message : joi.string().min(5).required(),
    author : joi.string().pattern(new RegExp('([A-zÀ-ú])\\s([A-zÀ-ú])')).required(),
    ts : joi.number().required()
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Joi = require('joi');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/chat/api/messages', (req, res) => {

    fs.readFile("mensajesHistoricos.json", 'utf8', function(err, data)
    {
        res.send(data);
    })
  })
  
app.get('/chat/api/messages/:msgId', (req, res) => {
    var buscado = req.params['msgId']
    fs.readFile("mensajesHistoricos.json", 'utf8', function(err, data)
    {
        var ret = []
        x = JSON.parse(data);
        for (var i in x)
        {
            if( x[i]['ts'] === buscado)
            {
                ret.push(x[i])
            }
        }
        if(!ret.length)
        {
            res.status(400).send("Error 400 - No existe un mensaje con ese ts")
        }
        else
        {
            res.send(ret)
        }
    })
 })

app.post('/chat/api/messages' , (req, res, next) =>
{
    let data = fs.readFileSync("./mensajesHistoricos.json");
    let obj = JSON.parse(data);
    let newData = req.body;

    valid = schema.validate(newData)
    if(!valid['error'])
    {
        /* obj.push(newData)
        fs.writeFile("./mensajesHistoricos.json", JSON.stringify(obj), function(err){
            if (err) throw err;
          });*/
        const ws = new WebSocket("ws://localhost:3000")
        ws.on('open', () =>
        {
              ws.send(JSON.stringify(newData))
            })
        res.status(201).send("creado exitosamente") 
    }
    else
    {
        res.status(400).send("Error con los datos")
    }
})

app.put('/chat/api/messages/' , (req, res) =>
{
    let newData = req.body;
    var buscado = newData['ts']
    valid = schema.validate(newData)
    if(!valid['error'])
    {
        fs.readFile("mensajesHistoricos.json", 'utf8', function(err, data)
    {
        var encontrado = false;
        x = JSON.parse(data);
        old = undefined;
        for (var i in x)
        {
            if( x[i]['ts'] === buscado)
            {
                old = x[i]
                encontrado = true;
                x[i]['Message'] = newData['Message'];
                x[i]['author'] = newData['author'];
            }
        }
        if( old!= undefined)
        {
            fs.writeFile("./mensajesHistoricos.json", JSON.stringify(x), function(err){
                if (err) throw err;
            });
            res.status(200).send(old);
        }
        else
        {
            res.status(404).send("No existe ese mensaje")
        }
        
        
    })
    }
    else
    {
        res.status(400).send("Error con los datos")
    }
    
})

app.delete('/chat/api/messages/:msgId' , (req, res) =>
{
    var buscado = req.params['msgId']
    fs.readFile("mensajesHistoricos.json", 'utf8', function(err, data)
    {
        var encontrado = false;
        x = JSON.parse(data);
        for(var i in x )
        {
            if( x[i]['ts'] == buscado)
            {
                delete x[i];
                encontrado = true
            }
        }
        if(encontrado)
        {
            x = x.filter(function(s) { return s !== null }); 
            fs.writeFile("./mensajesHistoricos.json", JSON.stringify(x), function(err){
                if (err) throw err;
              });
            res.send('eliminado')
        }
        else
        {
            res.status(404).send("No se encuentra ese mensaje")
        }
    })
})
  
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
