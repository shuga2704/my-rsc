import React, { Suspense } from 'react'
import styled from 'styled-components'

import { Counter } from "./components/Counter";
import ServerComponentSync from './components/ServerComponentSync'
import ServerComponentAsync from './components/ServerComponentAsync'

const StyledBlock = styled.div`
    background: lightseagreen;
`

export default function App() {
    return <div className="main">
        Это отрендерилось на сервере

        <StyledBlock>Styled-компонент</StyledBlock>

        <div className="client">
            <Suspense fallback="Загружаем клиентский компонент...">
                <Counter />
            </Suspense>
        </div>

        <ServerComponentSync />

        <div className="server-async">
            {/*<ServerComponentAsync />*/}
        </div>
    </div>;
}
