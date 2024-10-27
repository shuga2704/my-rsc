import { deserialize } from "./deserialize";

let data = new Map()

// Обертка для асинхронных серверных компонентов
export default function Placeholder({ name }) {
    if (!data.get(name)) {
        let promise = fetch("/getAsyncServerComponent/" + name)
            .then((res) => res.text())
            .then((str) => {
                data.set(name, deserialize(str))
            });

        throw promise
    } else {
        return data.get(name)
    }
}
