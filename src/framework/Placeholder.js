import withSuspense from './withSuspense'

import { promiseMap } from '../index'
import { createPromise } from '../utils'

// Обертка для асинхронных серверных компонентов
function Placeholder({ id }) {
    const component = promiseMap.get(id)

    if (!component) {
        const promise = createPromise();

        promiseMap.set(id, promise)

        throw promise
    } else {
        if (component instanceof Promise) {
            return null
        } else {
            return component
        }
    }
}

export default withSuspense(Placeholder)
