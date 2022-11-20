import {
    generateDeleteQuery,
    generateGetAllQuery,
    generateGetQuery,
    generatePostQuery,
    generatePutPatchQuery
} from "../../helpers/db-helper.js";
import {infoLogger} from "../../logger/logger.js";

//Repository manages database queries called from the Endpoint Handler.
//HTTPS requests will have already been validated before getting to this point.
const FILE_NAME = "sensor-data-repository.js"
const table_name = "sensor_data"

export default function sensorDataRepository ({ database }) {
    return Object.freeze({
        add,
        getAll,
        findBySensorDataId,
        remove,
        update
    })

    async function add(sensorData) {
        const METHOD = "add"
        const sqlQuery = generatePostQuery(table_name, sensorData)
        return new Promise(function (resolve, reject) {
            database.query(sqlQuery, (error, results) => {
                if (error) {
                    infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", error)
                    reject(error)
                }
                resolve({
                    data: results
                })
            })
        })
    }

    async function getAll() {
        const METHOD = "getAll"
        const sqlQuery = generateGetAllQuery(table_name)
        return new Promise(function (resolve, reject) {
            database.query(sqlQuery, (error, results) => {
                if (error) {
                    infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", error)
                    reject(error)
                }
                resolve({
                    data: results
                })
            })
        })
    }

    async function findBySensorDataId(sensorDataId) {
        const sqlQuery = generateGetQuery(table_name, sensorDataId)
        return new Promise(function (resolve, reject) {
            database.query(sqlQuery, (error, results) => {
                if (error) {
                    reject(error)
                }  else if(results.length === 0) {
                    resolve({
                        data: null
                    })
                }
                resolve({
                    data: results
                })
            })
        })
    }

    async function update(sensorData) {
        const sqlQuery = generatePutPatchQuery(table_name, sensorData, "sensorDataId")
        return new Promise(function (resolve, reject) {
            database.query(sqlQuery, (error, results) => {
                if (error) {
                    reject(error)
                }
                resolve({
                    data: results
                })
            })
        })
    }

    async function remove(sensorDataId) {
        const sqlQuery = generateDeleteQuery("generated_lead", sensorDataId)
        return new Promise(function (resolve, reject) {
            database.query(sqlQuery, (error, results) => {
                if (error) {
                    reject(error)
                }
                resolve({
                    data: results
                })
            })
        })
    }
}
