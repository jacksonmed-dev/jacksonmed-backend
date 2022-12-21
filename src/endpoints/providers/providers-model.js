import requiredParam from "../../helpers/required-param.js";
import optionalParam from "../../helpers/optional-param.js";
import {infoLogger} from "../../logger/logger.js";
import {toCamel} from "../../helpers/case.js";
const FILE_NAME="patient-model.js"

// Patient Model.
// Validates non-nullness for minimum necessary values and returns an immutable generated lead
// object so properties cannot be modified, added, or deleted downstream
export default function makeProviders(
    patientInfo = requiredParam('patientInfo')
) {
    const METHOD = 'makePatient'
    infoLogger.debug(FILE_NAME, METHOD, "ENTERING: ")
    patientInfo = toCamel(patientInfo)
    const validPatient = validate(patientInfo)
    infoLogger.debug(FILE_NAME, METHOD, "validPatient: ", validPatient)

    return Object.freeze(validPatient)

    function validate({
                          providerId = requiredParam('provider_id'),
                          firstName = requiredParam('first_name'),
                          lastName = requiredParam('last_name'),
                          role = requiredParam("role"),
                          isPresent = optionalParam(),
                          facilityId = requiredParam("facility_id"),
                      } = {}) {
        return {
            providerId,
            firstName: firstName?.toLowerCase(),
            lastName: lastName?.toLowerCase(),
            role: role?.toLowerCase(),
            isPresent,
            facilityId
        }
    }
}
