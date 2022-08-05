import express, { Request, Response } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import expressFileupload from "express-fileupload";
import cors from "cors";
import 'dotenv/config';
import { Route } from './routes/router';


import db from "./models";

const app = express();

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

db.sequelize.sync().then(() => {
    server.listen(port);
})

server.on('error', (error: Error) => {
    console.error(error);
});
server.on('listening', () => {
    console.info('Listening on ' + port);
});

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('52687071'));
app.use(expressFileupload());
app.set('trust proxy', true);
app.use(cors());

const route = new Route;
app.use(route.router);