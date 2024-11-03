import React, { Suspense } from "react";

const withSuspense = (Component) => {
    return (props) => {
        return <Suspense fallback="loading...">
            <Component {...props} />
        </Suspense>
    }
}

export default withSuspense
