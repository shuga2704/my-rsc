import React from 'react'

export default async function InnerServerComponentAsync() {
    await new Promise((res) => {
        setTimeout(res, 2000);
    });

    return (
        <div>
            Это тоже асинхронный серверный рендер, но вложенный в первый
        </div>
    );
}
