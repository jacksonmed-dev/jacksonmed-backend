import dotenv from 'dotenv'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import createError from 'http-errors';
import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import adaptRequest from './helpers/adapt-request.js'
import {
    expressLogger, infoLogger
} from "./logger/logger.js";

import makeSensorDataService from "./endpoints/sensor-data/index.js";
import makePatientService from "./endpoints/patient/index.js";

const FILE_NAME = "app.js"

export default function makeApp(database) {
    const METHOD = "makeApp"
    const app = express();
    app.use(expressLogger)

    //create the endpoint handlers
    const sensorDataEndpointHandler = makeSensorDataService(database)
    const patientEndpointHandler = makePatientService(database)
    //marketing-platform-service directory start

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json({limit:'5000mb'}));
    app.use(express.urlencoded({limit:'5000mb',extended: true}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    //Health Check
    app.get('/health', (req, res) => {
        res.status(200).send({health: "Health check passed"})
    })

    app.post('/sensor-data', sensorDataController)
    app.get('/sensor-data', sensorDataController)
    app.get('/sensor-data/:sensorDataId', sensorDataController)
    app.put('/sensor-data/:sensorDataId', sensorDataController)
    app.delete('/sensor-data/:sensorDataId', sensorDataController)
    function sensorDataController(req, res) {
        const httpsRequest = adaptRequest(req)
        sensorDataEndpointHandler(httpsRequest)
            .then(({headers, statusCode, data}) =>
                res.set(headers)
                    .status(statusCode)
                    .send(data)
            )
            .catch(({headers, statusCode, data}) => {
                infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", data)
                res.set(headers)
                    .status(statusCode)
                    .send(data)
                    .end()
            })
    }

    app.post('/patient', patientController)
    app.get('/patient', patientController)
    app.put('/patient', patientController)
    app.delete('/patient', patientController)
    function patientController(req, res) {
        const httpsRequest = adaptRequest(req)
        patientEndpointHandler(httpsRequest)
            .then(({headers, statusCode, data}) =>
                res.set(headers)
                    .status(statusCode)
                    .send(data)
            )
            .catch(({headers, statusCode, data}) => {
                infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", data)
                res.set(headers)
                    .status(statusCode)
                    .send(data)
                    .end()
            })
    }

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", err)
        infoLogger.error(FILE_NAME, METHOD, "Error from request: ", req)

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    return app
}


