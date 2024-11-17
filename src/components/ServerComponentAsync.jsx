import React from 'react'
import InnerServerComponentAsync from './InnerServerComponentAsync'

export default async function ServerComponentAsync() {
    await new Promise((res) => {
        setTimeout(res, 2000);
    });

    return (
        <div>
            Асинхронный рендер на сервере

            <div className="server-async">
                <InnerServerComponentAsync />
            </div>
        </div>
    );
}
