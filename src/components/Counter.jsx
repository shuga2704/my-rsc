"use client";

import React, { useState, useEffect } from "react";

export function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    useEffect(() => {}, [])

    return <button onClick={increment}>Counter: {count}</button>
}
