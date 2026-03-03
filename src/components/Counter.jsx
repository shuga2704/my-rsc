"use client";

import React, { useState, useEffect } from "react";
import styled from 'styled-components';

const Button = styled.button`
    background: lightsalmon;
    padding: 10px;
`

export function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    useEffect(() => {}, [])

    return <Button onClick={increment}>Counter: {count}</Button>
}
