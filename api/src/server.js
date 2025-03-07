

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import createRouter from './routes/create.js';
import loginRouter from './routes/login.js';
import listRouter from './routes/list.js';
import updateRouter from "./routes/update.js"
import deleteRouter from "./routes/delete.js"

import "./testing.js"

import { requestManager } from './utils/requestManager.js';

const PORT = process.env.PORT || 3001;

const app = express();

const isInDevelopment = true // process.env.NODE_ENV === "development"



const allowedOrigin = isInDevelopment ? "*" : (process.env.FORONTEND_URL || "http://localhost:3000")
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}))



//app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static("public"))
app.use(cookieParser())
app.use(requestManager())


app.use("",createRouter)
app.use("",loginRouter)
app.use("",listRouter)
app.use("",updateRouter)
app.use("",deleteRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})