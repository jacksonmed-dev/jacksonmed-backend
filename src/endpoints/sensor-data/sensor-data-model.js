import requiredParam from "../../helpers/required-param.js";
import optionalParam from "../../helpers/optional-param.js";
import {infoLogger} from "../../logger/logger.js";
const FILE_NAME="sensor-data-model.js"

// Generated Lead Model.
// Validates non-nullness for minimum necessary values and returns an immutable generated lead
// object so properties cannot be modified, added, or deleted downstream
export default function makeSensorData(
    sensorDataInfo = requiredParam('sensorDataInfo')
) {
    const METHOD = 'makeSensorData'
    infoLogger.debug(FILE_NAME, METHOD, "ENTERING: ")
    const validSensorData = validate(sensorDataInfo)
    infoLogger.debug(FILE_NAME, METHOD, "validSensorData: ", validSensorData)

    return Object.freeze(validSensorData)

    function validate({
                          date = requiredParam('ad_account_id'),
                          hour = requiredParam('ad_id'),
                          min = requiredParam('ad_set_id'),
                          sec = requiredParam('campaign_id'),
                          data = requiredParam('data'),
                          patient_present = requiredParam('patient_present')

                      } = {}) {
        return {
            date,
            hour,
            min,
            sec,
            data,
            patient_present
        }
    }
}
