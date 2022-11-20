import {InvalidPropertyError, RequiredParameterError, UniqueConstraintError} from "./error.js";

export function makeDummyDatabase(error) {
    switch (error) {
        case 'UniqueConstraintError':
            return { query: dummyQueryUniqueConstraintError }
            break
        case 'InvalidPropertyError':
            return { query: dummyQueryInvalidPropertyError }
            break
        case 'RequiredParameterError':
            return { query: dummyQueryRequiredParameterError }
            break
        default:
            return { query: dummyQuerySuccessful }
    }
}

function dummyQuerySuccessful(sql, callback) {
    const error = null
    const results = "dummy database successful"
    callback(error, results)
}

function dummyQueryUniqueConstraintError(sql, callback) {
    const results = ""
    callback(new UniqueConstraintError(), results)
}
function dummyQueryInvalidPropertyError(sql, callback) {
    const results = ""
    callback(new InvalidPropertyError(), results)
}
function dummyQueryRequiredParameterError(sql, callback) {
    const results = ""
    callback(new RequiredParameterError(), results)
}

export function generateDummyHttpsRequest(path, method, body){
    return {
        "path": path,
        "method": method,
        "pathParams": {},
        "queryParams": {},
        "body": body
    }
}
