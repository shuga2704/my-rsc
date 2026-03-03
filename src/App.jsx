import React, { Suspense } from 'react'
import styled from 'styled-components'

import { Counter } from "./components/Counter";
import ServerComponentSync from './components/ServerComponentSync'
import ServerComponentAsync from './components/ServerComponentAsync'

const Main = styled.div`
    padding: 1rem;
    background: #b6ffba;
    font-family: sans-serif;
`

const StyledBlock = styled.div`
    background: lightseagreen;
`

const Client = styled.div`
    padding: 1rem;
    margin: 1rem;
    background: #ff000087;
`

export const ServerAsync = styled.div`
    padding: 1rem;
    margin: 1rem;
    background: #5b5bff80;
`

export default function App() {
    return <Main>
        Это отрендерилось на сервере

        <StyledBlock>Styled-компонент</StyledBlock>

        <Client>
            <Suspense fallback="Загружаем клиентский компонент...">
                <Counter />
            </Suspense>
        </Client>

        <ServerComponentSync />

        <ServerAsync>
            <ServerComponentAsync />
        </ServerAsync>
    </Main>;
}
