import generatePutQuery from "../db-helper.js"

describe('this is a dummy test', () => {
    test('test 1', () => {
        const result = generatePutQuery()
        expect("Test").toBe("Test")
    })
})

describe('test db-helper.js', () => {
    test('test facebook-facebook-ad-account update query', () => {
        const expectedQuery = "UPDATE ad_account SET marketing_platform_business_id = 'TEST Business ID' and ad_account_id = 'TEST Ad Account ID' ad_account_id = 'TEST Ad Account ID' and WHERE ad_account_id = 'TEST Ad Account ID'"

        const tableName = "ad_account"
        const primaryKeyColumn = "adAccountId"
        const adAccountModel = {
            "externalBusinessId": "TEST Business ID",
            "adAccountId": "TEST Ad Account ID"
        }
        const result = generatePutQuery(tableName, adAccountModel, primaryKeyColumn)
        expect(result).toBe(expectedQuery)
    })
})
