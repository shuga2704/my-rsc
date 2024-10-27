import React, { Suspense } from 'react'
import ServerComponentAsync2 from './ServerComponentAsync2'

export default async function ServerComponentAsync() {
    await new Promise((res) => {
        setTimeout(res, 1000);
    });

    return (
        <div>
            ServerComponentAsync

            <br />

            <Suspense fallback="async 2 loading...">
                <ServerComponentAsync2 />
            </Suspense>
        </div>
    );
}
