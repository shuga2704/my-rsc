import React, { Suspense } from 'react'

import { Counter } from "./components/Counter";
import ServerComponentSync from './components/ServerComponentSync'
import ServerComponentAsync from './components/ServerComponentAsync'

export default function App() {
    return <div className="main">
        some text

        <Suspense fallback="Loading client component...">
            <Counter />
        </Suspense>

        <ServerComponentSync />

        <br />

        <Suspense fallback="Loading async server comp...">
            <ServerComponentAsync />
        </Suspense>
    </div>;
}
