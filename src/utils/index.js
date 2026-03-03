export const createPromise = () => {
    let res = null

    const promise = new Promise((resolve) => {
        res = resolve
    })

    promise.resolve = res

    return promise
}

export const isReactElement = (jsx) => {
    return jsx?.["$$typeof"] === Symbol.for("react.element")
        || jsx?.["$$typeof"] === Symbol.for("react.transitional.element");
}

export const isStyledComponent = (type) => {
    return type?.$$typeof === Symbol.for("react.forward_ref")
        && typeof type.styledComponentId === "string"
        && type.target != null;
}

export const mergeClassNames = (...classNames) => {
    const value = classNames.filter(Boolean).join(" ");
    return value || undefined;
}

export const createStyledStyleElement = (type, jsx) => {
    const css = (type.componentStyle?.rules || [])
        .filter((rule) => typeof rule === "string")
        .join("")
        .trim();

    if (!css) {
        return null;
    }

    return {
        $$typeof: jsx.$$typeof,
        type: "style",
        key: `style:${type.styledComponentId}`,
        props: {
            href: `rsc-style:${type.styledComponentId}`,
            precedence: "medium",
            children: `.${type.styledComponentId} {${css}}`,
        },
        _owner: null,
        _store: {},
    };
}
