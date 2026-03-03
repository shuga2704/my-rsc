import React, { Suspense } from "react";
import { createRoot } from 'react-dom/client';
import { deserialize } from './framework/deserialize'
import { createPromise } from './utils'

// Создаем коллекцию для хранения промисов и (в результате) их компонентов.
export const promiseMap = new Map()

createRoot(document.getElementById('root')).render(
    <Suspense fallback={null}>
        <Root />
    </Suspense>
);

// Начинаем порционно получать отрендеренные компоненты с сервера в режиме стриминга.
// Запрос выполниться только когда придет последний компонент.
fetch("/stream").then((res) => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processPayload = (chunk) => {
        if (!chunk) return;

        const payload = deserialize(chunk);
        const promiseFromTarget = promiseMap.get(payload.target)

        promiseMap.set(payload.target, payload.data)

        if (promiseFromTarget instanceof Promise) {
            promiseFromTarget.resolve()
        }

        console.log('payload', payload)
    };

    const read = () => {
        reader.read().then(({ done, value }) => {
            if (done) {
                processPayload(buffer.trim())
                return
            }

            buffer += decoder.decode(value, { stream: true });

            const payloads = buffer.split("\n");
            buffer = payloads.pop() || "";

            payloads.forEach((chunk) => {
                processPayload(chunk.trim())
            })

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
