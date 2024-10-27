import LazyContainer from "./LazyContainer";
import Placeholder from "./Placeholder";

// Утилита для десериализации строки в react-дерево
export function deserialize(str) {
    const json = JSON.parse(str, (key, value) => {
        if (key === "$$typeof") {
            if (value === "Symbol(react.element)") {
                return Symbol.for("react.element");
            }

            throw new Error("unexpected $$typeof", value);
        }

        if (key === "type" && value === "Symbol(react.suspense)") {
            return Symbol.for("react.suspense");
        }

        return value;
    });

    return replaceClientComponent(json);
}

export function replaceClientComponent(data) {
    if (data == null || typeof data !== "object") {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(replaceClientComponent);
    }

    if (data.type === "$LazyContainer") {
        return {
            ...data,
            props: replaceClientComponent(data.props),
            type: LazyContainer,
        };
    }

    if (data.type === "$Placeholder") {
        return {
            ...data,
            props: replaceClientComponent(data.props),
            type: Placeholder,
        };
    }

    return Object.keys(data).reduce((result, key) => {
        const value = replaceClientComponent(data[key]);
        result[key] = value;
        return result;
    }, {});
}
