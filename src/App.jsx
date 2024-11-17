import React, { Suspense } from 'react'

import { Counter } from "./components/Counter";
import ServerComponentSync from './components/ServerComponentSync'
import ServerComponentAsync from './components/ServerComponentAsync'

export default function App() {
    return <div className="main">
        Это отрендерилось на сервере

        <div className="client">
            <Suspense fallback="Загружаем клиентский компонент...">
                <Counter />
            </Suspense>
        </div>

        <ServerComponentSync />

        <div className="server-async">
            <ServerComponentAsync />
        </div>
    </div>;
}
