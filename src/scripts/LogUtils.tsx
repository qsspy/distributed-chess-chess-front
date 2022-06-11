export function isError(response: any) {
    return response.status != 200
}

export function logError(response: any) {
    if (isError(response)) {
        console.log(response.message + "\n" + response.description)
    }
}