export default function makeHttpsError ({ statusCode, errorMessage }) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode,
        data: JSON.stringify({
            success: false,
            error: errorMessage
        })
    }
}
