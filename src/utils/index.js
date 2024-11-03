export const createPromise = () => {
    let res = null

    const promise = new Promise((resolve) => {
        res = resolve
    })

    promise.resolve = res

    return promise
}
