export function generatePostQuery(tableName, dbObject) {
    let sqlQuery = `INSERT INTO ${tableName} (`
    Object.keys(dbObject).forEach((key, index, arr) => {
        sqlQuery += `${camelToSnakeCase(key)}, `
    })
    sqlQuery = sqlQuery.slice(0, -2); // Remove last empty space and ","

    sqlQuery += `) VALUES(`
    Object.entries(dbObject).forEach(([key, value]) => {
        const valueToSet = typeof(dbObject[key]) === 'string' ? `'${value}'` : value;
        sqlQuery += `${valueToSet}, `
    });
    sqlQuery = sqlQuery.slice(0, -2); // Remove last empty space and ","
    sqlQuery += ')'
    return sqlQuery
}

export function generateGetQuery(tableName, searchKey) {
    return `SELECT * FROM ${tableName} WHERE ${camelToSnakeCase(Object.keys({searchKey})[0])} = searchKey`
}

export function generateGetAllQuery(tableName) {
    return `SELECT * FROM ${tableName}`
}

//MySQL functions the same way for PUT and PATCH
export function generatePutPatchQuery(tableName, dbObject, searchKey) {
    let sqlQuery = `UPDATE ${tableName} SET`
    Object.entries(dbObject).forEach(([key, value]) => {
        const valueToSet = typeof(dbObject[key]) === 'string' ? `'${value}'` : value;
        sqlQuery += ` ${key}=${valueToSet},`
    });
    sqlQuery = sqlQuery.slice(0, -1); // Remove last ","
    sqlQuery += ` WHERE ${camelToSnakeCase(Object.keys({searchKey})[0])} = '${dbObject[searchKey]}'`
    return sqlQuery;
}

export function generateDeleteQuery(tableName, primaryKey) {
    return `DELETE FROM ${tableName} WHERE ${camelToSnakeCase(Object.keys({primaryKey})[0])} = primaryKey`
}

function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
