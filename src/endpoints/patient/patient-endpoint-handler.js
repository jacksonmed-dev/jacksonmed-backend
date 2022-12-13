import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
} from '../../helpers/error.js'
import makeHttpsError from '../../helpers/https-error.js'
import {infoLogger} from "../../logger/logger.js";
import makePatient from "./patient-model.js";

const FILE_NAME = 'patient-endpoint-handler.js'

export default function makePatientEndpointHandler({ repository: patientRepository }) {
    return async function handle(httpsRequest) {
        switch(httpsRequest.method) {
            case "POST":
                return postPatient(httpsRequest)
            case "GET":
                return getPatient(httpsRequest)
            case "PUT":
                return putPatient(httpsRequest)
            case "DELETE":
                return deletePatient(httpsRequest)
            default:
                return makeHttpsError({
                    statusCode: 405,
                    errorMessage: `${httpsRequest.method} method not allowed.`
                })
        }
    }

    async function postPatient(httpsRequest) {
        const METHOD = 'postPatient'
        infoLogger.debug(FILE_NAME, METHOD, "httpsRequest: ", httpsRequest)

        let patientInfo = httpsRequest.body
        if (!patientInfo) {
            return makeHttpsError({
                statusCode: 400,
                errorMessage: 'Bad request. No POST body.'
            })
        }

        if (typeof httpsRequest.body === 'string') {
            try {
                patientInfo = JSON.parse(patientInfo)
            } catch {
                return makeHttpsError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })
            }
        }

        try {
            const patient = makePatient(patientInfo)
            infoLogger.debug(FILE_NAME, METHOD, "patient: ", patient)

            const { success, result } = await patientRepository.add(patient)
            return {
                headers: httpsRequest.headers,
                statusCode: 201,
                data: JSON.stringify(result)
            }
        } catch (e) {
            infoLogger.error(FILE_NAME, METHOD, "Error Caught: ", e)
            return makeHttpsError({
                errorMessage: e.message,
                statusCode:
                    e instanceof UniqueConstraintError
                        ? 409
                        : e instanceof InvalidPropertyError ||
                        e instanceof RequiredParameterError
                            ? 400
                            : 500
            })
        }
    }

    async function getPatient(httpsRequest) {
        const { firstName, lastName, birthday } = httpsRequest.queryParams || {}
        const patientId = {firstName, lastName, birthday}
        if(patientId) {
            const result = patientId ? await patientRepository.findByPatientId(patientId) : null
            return {
                headers: httpsRequest.headers,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        }else {
            const result =  await patientRepository.getAll()
            return {
                headers: httpsRequest.headers,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        }

    }

    async function putPatient(httpsRequest) {
        let patientInfo = httpsRequest.body
        if (!patientInfo) {
            return makeHttpsError({
                statusCode: 400,
                errorMessage: 'Bad request. No PUT body.'
            })
        }

        if (typeof httpsRequest.body === 'string') {
            try {
                patientInfo = JSON.parse(patientInfo)
            } catch {
                return makeHttpsError({
                    statusCode: 400,
                    errorMessage: 'Bad request. PUT body must be valid JSON.'
                })
            }
        }
        try {
            const patient = makeSensorData(patientInfo)
            const { success, result } = await patientRepository.update(patient)
            return {
                headers: httpsRequest.headers,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        } catch(e) {
            makeHttpsError({
                errorMessage: e.message,
                statusCode:
                    e instanceof UniqueConstraintError
                        ? 409
                        : e instanceof InvalidPropertyError ||
                        e instanceof RequiredParameterError
                            ? 400
                            : 500
            })
        }
    }

    async function deletePatient(httpsRequest) {
        const { patientId } = httpsRequest.pathParams || {}

        const result = patientId ? await patientRepository.remove(patientId) : null
        return {
            headers: httpsRequest.headers,
            statusCode: 200,
            data: JSON.stringify(result)
        }
    }
}
