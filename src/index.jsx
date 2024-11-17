import React from "react";
import ReactDOM from "react-dom";
import { deserialize } from './framework/deserialize'
import { createPromise } from './utils'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

// Создаем коллекцию для хранения промисов и (в результате) их компонентов.
export const promiseMap = new Map()

// Начинаем порционно получать отрендеренные компоненты с сервера в режиме стриминга.
// Запрос выполниться только когда придет последний компонент.
fetch("/stream").then((res) => {
    const reader = res.body.getReader();

    const read = () => {
        reader.read().then(({ done, value }) => {
            if (done) return

            const decoder = new TextDecoder();

            const payload = deserialize(decoder.decode(value));

            const promiseFromTarget = promiseMap.get(payload.target)

            promiseFromTarget.resolve()

            promiseMap.set(payload.target, payload.data)

            console.log('payload', payload)

            read();
        });
    };

    read();
});

function Root() {
    const component = promiseMap.get('index')

    if (!component) {
        const promise = createPromise();

        promiseMap.set('index', promise)

        throw promise
    } else {
        if (component instanceof Promise) {
            return null
        } else {
            return component
        }
    }
}
