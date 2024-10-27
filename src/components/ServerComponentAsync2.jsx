import React from 'react'

export default async function ServerComponentAsync2() {
    await new Promise((res) => {
        setTimeout(res, 1000);
    });

    return (
        <div>
            ServerComponentAsync 2
        </div>
    );
}
