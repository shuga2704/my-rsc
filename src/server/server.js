import express from 'express'
import { readFileSync } from 'fs'
import path from 'path'

import renderToPipeableStream from "./renderToPipeableStream";

const app = express()
const PORT = 4001

// Доступ к статичным файлам из директории public
app.use("/", express.static(path.join(__dirname, "../../public")));

app.get("/", (req, res) => {
    const html = readFileSync(path.resolve(__dirname, "../../public/index.html"), "utf-8")
    res.send(html)
})

// Корневой элемент приложения для рендера на сервере
const ReactApp = require(path.join(
    __dirname,
    "../App.js"
)).default

app.get("/stream", async (req, res) => {
    const json = await ReactApp();

    renderToPipeableStream(json, res);
});

app.listen(PORT, () => {
    console.log(`App is live at http://localhost:${PORT}`);
});
