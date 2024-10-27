import React, { Suspense } from "react";

const withSuspense = (Component) => {
    return (props) => {
        return <Suspense>
            <Component {...props} />
        </Suspense>
    }
}

export default withSuspense
