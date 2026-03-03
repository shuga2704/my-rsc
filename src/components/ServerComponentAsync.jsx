import React from 'react'
import InnerServerComponentAsync from './InnerServerComponentAsync'
import { ServerAsync } from '../App'

export default async function ServerComponentAsync() {
    await new Promise((res) => {
        setTimeout(res, 2000);
    });

    return (
        <div>
            Асинхронный рендер на сервере

            <ServerAsync>
                <InnerServerComponentAsync />
            </ServerAsync>
        </div>
    );
}
