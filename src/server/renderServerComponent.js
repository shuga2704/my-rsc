import componentMap from "../../built/utils/componentMap";

export default function render(jsx) {
    if (jsx == null) {
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
        return jsx.map((item) => render(item));
    }

    if (jsx["$$typeof"] === Symbol.for("react.element")) {
        // if intrinsic html tag
        if (typeof jsx.type === "string") {
            return { ...jsx, props: render(jsx.props) };
        }

        // if function components
        if (typeof jsx.type === "function") {
            // if client component

            if (componentMap.clientComponents.includes(jsx.type.name)) {
                return {
                    ...jsx,
                    props: {
                        ...render(jsx.props),
                        name: jsx.type.name,
                    },
                    type: "$LazyContainer",
                };
            } else {
                // server component

                const rendered = jsx.type(jsx.props);

                if ("then" in rendered) {
                    // async server component

                    return {
                        $$typeof: Symbol.for("react.element"),
                        type: "$Placeholder",
                        props: {
                            name: jsx.type.name
                        },
                        ref: null,
                    };
                } else {
                    // sync server component

                    return render(rendered);
                }
            }
        }
    }

    return Object.keys(jsx).reduce((result, key) => {
        result[key] = render(jsx[key]);
        return result;
    }, {});
}
