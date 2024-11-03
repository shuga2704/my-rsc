import componentMap from "../../built/utils/componentMap";
import serialize from "./serialize";

function render(jsx, context) {
    if (jsx === null) {
        return null;
    }

    if (
        typeof jsx === "string" ||
        typeof jsx === "number" ||
        typeof jsx === "symbol"
    ) {
        return jsx;
    }

    if (Array.isArray(jsx)) {
        return jsx.map((item) => render(item, context));
    }

    if (jsx["$$typeof"] === Symbol.for("react.element")) {
        // Является ли элемент html-тегом
        if (typeof jsx.type === "string") {
            return { ...jsx, props: render(jsx.props, context) };
        }

        // Или функциональным компонентом
        if (typeof jsx.type === "function") {
            // Если компонент клиентский
            if (componentMap.clientComponents.includes(jsx.type.name)) {
                return {
                    ...jsx,
                    props: {
                        ...render(jsx.props, context),
                        name: jsx.type.name,
                    },
                    type: "$LazyContainer",
                };
            } else { // Если не клиентский (а серверный)
                const rendered = jsx.type(jsx.props);

                const id = "C:" + context.id++;

                // Если серверный компонент - асинхронный
                if ("then" in rendered) {
                    context.tasks.add(rendered);

                    rendered.then((json) => {
                        context.tasks.delete(rendered);

                        context.pipe({
                            target: id,
                            data: render(json, context),
                        });
                    });

                    // Возвращаем заглушку для асинхронного компонента
                    return {
                        $$typeof: Symbol.for("react.element"),
                        type: "$Placeholder",
                        props: {
                            id,
                            name: jsx.type.name
                        },
                        ref: null,
                    };
                } else { // Если серверный компонент синхронный
                    return render(rendered, context);
                }
            }
        }
    }

    return Object.keys(jsx).reduce((result, key) => {
        result[key] = render(jsx[key], context);
        return result;
    }, {});
}

export default function renderToPipeableStream(jsx, res) {
    const context = {
        id: 0,
        tasks: new Set(),
    };

    const pipe = (json) => {
        res.write(serialize(json));

        if (context.tasks.size === 0) {
            res.end();
        }
    };

    context.pipe = pipe;

    pipe({
        target: "index",
        data: render(jsx, context),
    });
}
