import React from "react";

let Component = null

// Обертка для клиентских компонентов
export default function LazyContainer({ name, ...rest }) {
    if (Component) {
        return <Component />
    } else {
        let promise = import("/Counter.js")
            .then(
                (module) => {
                    Component = module.default.Counter;
                }
            );

        throw promise
    }
}
