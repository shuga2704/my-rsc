import React from "react";
import ReactDOM from "react-dom";
import { deserialize } from './framework/deserialize'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

let data = null

function Root() {
    if (!data) {
        let promise = fetch("/payload")
            .then((res) => res.text())
            .then((str) => {
                data = deserialize(str)
            });

        throw promise
    } else {
        return data
    }
}
