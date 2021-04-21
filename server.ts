import { Socket } from 'dgram';
import express from 'express';
const app = express()
import session from 'express-session';
const http = require('http').createServer(app);
const io = require('socket.io')(http);
import {NuevoProducto} from './public/service/producto.service'
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
const cookieParser = require('cookie-parser');
app.use(cookieParser());


declare module "express-session" {
    interface Session {
      user: string;
    }
  }

// INICIACION SESSION //

app.use(session({
    secret:'secreto',
    resave:true,
    saveUninitialized : true
}))


//endpoints 



app.get('/login-form',(req,res) => {
res.sendFile(__dirname+'/public/login.html')
})


app.post('/login',(req,res)=>{
 req.session.user = req.body.nombre
    res.redirect('/formulario')

   
})

app.get('/formulario',(req,res)=>{
    res.sendFile(__dirname+'/public/formulario.html');
    const user = req.session.user
    console.log(`Hola ${user}`)
    
})

app.get('/logout',(req,res) => {
    res.sendFile(__dirname+'/public/chau.html')
    })
    



app.get('/logout',(req,res)=>{
    req.session.destroy(function (err) {
      res.redirect('/logout'); 
     });
  })
  



//socket 
io.on('connection', (socket:any) => {
    //recibe lo que viene del script formulario
    socket.on('producto nuevo', (message:any)=>{
       console.log(message) //el  mensaje me traeria los datos del input
        io.emit('producto nuevo', message); //muestra a todoslos usuarios en tiempo rea
    })
})

//conexión
http.listen(3333, () => {
   console.log('Corriendo :)')
})
