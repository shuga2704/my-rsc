import React, { useState, useEffect } from "react";

export function Counter2() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    useEffect(() => {}, [])

    return <button onClick={increment}>Counter2: {count}</button>
}
