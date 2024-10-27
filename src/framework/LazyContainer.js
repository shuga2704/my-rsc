import React from "react";
import withSuspense from './withSuspense'

let data = new Map()

// Обертка для клиентских компонентов
function LazyContainer({ name }) {
    const Component = data.get(name)

    if (!Component) {
        throw import((`/${name}.js`))
            .then(
                (module) => {
                    data.set(name, module.default[name]);
                }
            );
    }

    return <Component />
}

export default withSuspense(LazyContainer)
