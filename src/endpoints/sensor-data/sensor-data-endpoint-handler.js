import {
    UniqueConstraintError,
    InvalidPropertyError,
    RequiredParameterError
} from '../../helpers/error.js'
import makeHttpsError from '../../helpers/https-error.js'
import makeSensorData from './sensor-data-model.js'
import {infoLogger} from "../../logger/logger.js";

const FILE_NAME = 'sensor-data-endpoint-handler.js'

export default function makeSensorDataEndpointHandler({ repository: sensorDataRepository }) {
    return async function handle(httpsRequest) {
        switch(httpsRequest.method) {
            case "POST":
                return postSensorData(httpsRequest)
            case "GET":
                return getSensorData(httpsRequest)
            case "PUT":
                return putSensorData(httpsRequest)
            case "DELETE":
                return deleteSensorData(httpsRequest)
            default:
                return makeHttpsError({
                    statusCode: 405,
                    errorMessage: `${httpsRequest.method} method not allowed.`
                })
        }
    }

    async function postSensorData(httpsRequest) {
        const METHOD = 'postSensorData'
        infoLogger.debug(FILE_NAME, METHOD, "httpsRequest: ", httpsRequest)

        let sensorDataInfo = httpsRequest.body
        if (!sensorDataInfo) {
            return makeHttpsError({
                statusCode: 400,
                errorMessage: 'Bad request. No POST body.'
            })
        }

        if (typeof httpsRequest.body === 'string') {
            try {
                sensorDataInfo = JSON.parse(sensorDataInfo)
            } catch {
                return makeHttpsError({
                    statusCode: 400,
                    errorMessage: 'Bad request. POST body must be valid JSON.'
                })
            }
        }

        try {
            const sensorData = makeSensorData(sensorDataInfo)
            infoLogger.debug(FILE_NAME, METHOD, "sensorData: ", sensorData)

            const { success, result } = await sensorDataRepository.add(sensorData)
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

    async function getSensorData(httpsRequest) {
        const { sensorDataId } = httpsRequest.pathParams || {}

        if(sensorDataId) {
            const result = sensorDataId ? await sensorDataRepository.findBySensorDataId(sensorDataId) : null
            return {
                headers: httpsRequest.headers,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        }else {
            const result =  await sensorDataRepository.getAll()
            return {
                headers: httpsRequest.headers,
                statusCode: 200,
                data: JSON.stringify(result)
            }
        }

    }

    async function putSensorData(httpsRequest) {
        let generatedLeadInfo = httpsRequest.body
        if (!generatedLeadInfo) {
            return makeHttpsError({
                statusCode: 400,
                errorMessage: 'Bad request. No PUT body.'
            })
        }

        if (typeof httpsRequest.body === 'string') {
            try {
                generatedLeadInfo = JSON.parse(generatedLeadInfo)
            } catch {
                return makeHttpsError({
                    statusCode: 400,
                    errorMessage: 'Bad request. PUT body must be valid JSON.'
                })
            }
        }
        try {
            const sensorData = makeSensorData(generatedLeadInfo)
            const { success, result } = await sensorDataRepository.update(sensorData)
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

    async function deleteSensorData(httpsRequest) {
        const { sensorDataId } = httpsRequest.pathParams || {}

        const result = sensorDataId ? await sensorDataRepository.remove(sensorDataId) : null
        return {
            headers: httpsRequest.headers,
            statusCode: 200,
            data: JSON.stringify(result)
        }
    }
}
