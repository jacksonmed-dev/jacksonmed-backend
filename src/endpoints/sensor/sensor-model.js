import requiredParam from "../../helpers/required-param.js";
import {infoLogger} from "../../logger/logger.js";
import {toCamel} from "../../helpers/case.js";
const FILE_NAME="sensor-model.js"

// Patient Model.
// Validates non-nullness for minimum necessary values and returns an immutable generated lead
// object so properties cannot be modified, added, or deleted downstream
export default function makeSensor(
    sensorInfo = requiredParam('sensorInfo')
) {
    const METHOD = 'makeSensor'
    infoLogger.debug(FILE_NAME, METHOD, "ENTERING: ")
    sensorInfo = toCamel(sensorInfo)
    const validSensor = validate(sensorInfo)
    infoLogger.debug(FILE_NAME, METHOD, "validSensor: ", validSensor)

    return Object.freeze(validSensor)

    function validate({
                          sensorId = requiredParam('room_id'),
                          ipAddress = requiredParam('first_name'),
                          facilityId = requiredParam('last_name'),
                      } = {}) {
        return {
            sensorId,
            ipAddress,
            facilityId,
        }
    }
}
