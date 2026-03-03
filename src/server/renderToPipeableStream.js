import componentMap from "../../built/utils/componentMap";
import serialize from "./serialize";
import { isReactElement, isStyledComponent, mergeClassNames, createStyledStyleElement } from '../utils'

function render(jsx, context) {
    if (jsx == null || typeof jsx === "boolean") {
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

    if (isReactElement(jsx)) {
        // Является ли элемент html-тегом
        if (typeof jsx.type === "string") {
            return { ...jsx, props: render(jsx.props, context) };
        }

        if (typeof jsx.type === "symbol") {
            return { ...jsx, props: render(jsx.props, context) };
        }

        // Styled-components в React 19 приходят как forwardRef-объекты.
        // Для этого проекта достаточно развернуть их обратно в обычный тег.
        if (isStyledComponent(jsx.type)) {
            const renderedElement = render({
                ...jsx,
                type: jsx.type.target,
                props: {
                    ...jsx.props,
                    className: mergeClassNames(
                        jsx.props?.className,
                        jsx.type.styledComponentId,
                    ),
                },
            }, context);

            if (context.styled.has(jsx.type.styledComponentId)) {
                return renderedElement;
            }

            context.styled.add(jsx.type.styledComponentId);

            const styleElement = createStyledStyleElement(jsx.type, jsx);

            if (!styleElement) {
                return renderedElement;
            }

            return [styleElement, renderedElement];
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
                if (rendered != null && typeof rendered.then === "function") {
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
                        $$typeof: jsx.$$typeof,
                        type: "$Placeholder",
                        key: jsx.key ?? null,
                        props: {
                            id,
                            name: jsx.type.name
                        },
                        ref: null,
                        _owner: null,
                        _store: {},
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
        styled: new Set(),
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
