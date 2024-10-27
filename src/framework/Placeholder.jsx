import { deserialize } from "./deserialize";
import withSuspense from './withSuspense'

let data = new Map()

// Обертка для асинхронных серверных компонентов
function Placeholder({ name }) {
    if (!data.get(name)) {
        throw fetch("/getAsyncServerComponent/" + name)
            .then((res) => res.text())
            .then((str) => {
                data.set(name, deserialize(str))
            });
    } else {
        console.log('data', data.get(name))

        return data.get(name)
    }
}

export default withSuspense(Placeholder)
