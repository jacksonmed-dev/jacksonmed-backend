import requiredParam from "../../helpers/required-param.js";
import {infoLogger} from "../../logger/logger.js";
import {toCamel} from "../../helpers/case.js";
const FILE_NAME="facility_model.js"

// Patient Model.
// Validates non-nullness for minimum necessary values and returns an immutable generated lead
// object so properties cannot be modified, added, or deleted downstream
export default function makeFacility(
    facilityInfo = requiredParam('facilityInfo')
) {
    const METHOD = 'makePatient'
    infoLogger.debug(FILE_NAME, METHOD, "ENTERING: ")
    facilityInfo = toCamel(facilityInfo)
    const validFacility = validate(facilityInfo)
    infoLogger.debug(FILE_NAME, METHOD, "validFacility: ", validFacility)

    return Object.freeze(validFacility)

    function validate({
                          facilityId = requiredParam('facility_id'),
                          facilityName = requiredParam('first_name'),
                          address = requiredParam('address')
                      } = {}) {
        return {
            facilityId,
            facilityName: facilityName?.toLowerCase(),
            address: address?.toLowerCase(),
        }
    }
}
