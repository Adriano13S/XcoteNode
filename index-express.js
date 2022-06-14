const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./router');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const corsOp = {
    origin : [process.env.CORS1, process.env.CORS2]
};

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOp));


app.listen(port, ()=> console.log(`Listening on ${port}`));
app.use('/', router);


// ERROR HANDLER NOT FOUND (if req does not match any req.url in router it end in here, where we create an error message and give it a status code, and we next it to the next middleware)
const notFOUND = (req, res, next) =>{
    const error = new Error(`Cannot find url ${req.originalUrl}`);
    res.status(404);
    next(error);
};
app.use(notFOUND);

//ERROR HANDLER (in this middleware ends every req that res with an error, here we display the error to the user and we give it a status code, except 404 that we define above ^)
const errorHandeler = (error, req, res, next)=>{
    const status = res.statusCode === 404?res.statusCode: 400;
    res.status(status);
    res.json({
        message : error.message,
        error : process.env.NODE_ENV === 'production'? error.message : error.stack,
        code : res.statusCode
    });
};
app.use(errorHandeler);









