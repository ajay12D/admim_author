
import express from "express";
import { connect_db } from "./config/db.js";
import * as url from 'url';
import cors from 'cors';
const __filename = url.fileURLToPath(import.meta.url);
import auth_router from "./route/auth_route.js"
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from "path"
const app = express(); 
import {Server} from "socket.io";
import http from 'http';


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', auth_router)
app.use('/', (req,res) => {

    res.sendFile(__dirname + "/public/index.html");
});     

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        method:  ["GET", "POST"],
    }
});




io.on("connection", (socket) => {
    const data = "user craeted successfully"
    console.log("user connected", socket.id);
   
     socket.on("signup", (data)=>{
        io.emit("registerd", data);
     })
});


server.listen(PORT, connect_db(),() => {
    console.log(`server is running on port ${PORT}`);
});