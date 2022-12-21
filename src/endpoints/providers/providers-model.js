import requiredParam from "../../helpers/required-param.js";
import optionalParam from "../../helpers/optional-param.js";
import {infoLogger} from "../../logger/logger.js";
import {toCamel} from "../../helpers/case.js";
const FILE_NAME="patient-model.js"

// Patient Model.
// Validates non-nullness for minimum necessary values and returns an immutable generated lead
// object so properties cannot be modified, added, or deleted downstream
export default function makeProviders(
    providersInfo = requiredParam('providersInfo')
) {
    const METHOD = 'makeProviders'
    infoLogger.debug(FILE_NAME, METHOD, "ENTERING: ")
    providersInfo = toCamel(providersInfo)
    const validProviders = validate(providersInfo)
    infoLogger.debug(FILE_NAME, METHOD, "validProviders: ", validProviders)

    return Object.freeze(validProviders)

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
