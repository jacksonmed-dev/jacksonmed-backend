import {
    generateDeleteQuery,
    generateGetAllQuery, generateGetPatientQuery,
    generateGetQuery,
    generatePostQuery,
    generatePutPatchQuery
} from "../../helpers/db-helper.js";
import {infoLogger} from "../../logger/logger.js";

//Repository manages database queries called from the Endpoint Handler.
//HTTPS requests will have already been validated before getting to this point.
const FILE_NAME = "patient-repository.js"
const table_name = "patient"

export default function patientRepository ({ database }) {
    return Object.freeze({
        add,
        getAll,
        findByPatientId,
        remove,
        update
    })

    async function add(patient) {
        const METHOD = "add"
        const sqlQuery = generatePostQuery(table_name, patient)
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

    async function findByPatientId(patientId) {
        const sqlQuery = generateGetPatientQuery(table_name, patientId)
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
                    data: results?.rows
                })
            })
        })
    }

    async function update(patient) {
        const sqlQuery = generatePutPatchQuery(table_name, patient, "patientId")
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

    async function remove(patientId) {
        const sqlQuery = generateDeleteQuery("patient", patientId)
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
