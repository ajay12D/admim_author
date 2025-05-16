
import express from "express";
import { connect_db } from "./config/db.js";
import auth_router from "./route/auth_route.js"
import * as url from 'url';
import cors from 'cors';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from "path"
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', auth_router)
app.use('/', (req,res) => {

    res.sendFile(__dirname + "/public/index.html");
});     

app.listen(PORT, connect_db(),() => {
    console.log(`server is running on port ${PORT}`);
});