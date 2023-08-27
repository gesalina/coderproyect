import express from "express";
import session from "express-session";
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from 'cookie-parser';
import initializePassport from "../src/middlewares/auth.middleware.js";
import run from './run.js';


dotenv.config()

const app = express();

/**
* Set the templates engine
*/
app.engine('handlebars', handlebars.engine());
app.set('views', './src/routers/views');
app.set('view engine', 'handlebars');

/**
 * User mongo sessions
 */
app.use(session({
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.USER}:${process.env.KEY}@${process.env.MONGO_DATABASE_URL}`,
        dbName: 'sessions',
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret:'gsal',
    resave:true,
    saveUninitialized: true
}))

/**
 * Initialize passport
 */

initializePassport();

app.use(passport.initialize());
app.use(passport.session());

/**
 * Cookie parser
 */
app.use(cookieParser());

/**
* Middleware for parse to JSON 
*/
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/**
* Set the static folder
*/
app.use('/content', express.static('./public'));


/**
* Establish database connection
*/
let serverHttp;

try {
    await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.KEY}@${process.env.MONGO_DATABASE_URL}`)
    serverHttp = app.listen(process.env.PORT, () => console.log(`Server is running at: http://localhost:8080`));                                                      
    const io = new Server(serverHttp);  
    run(io, app)
} catch(err) {
    console.log(err)
}

