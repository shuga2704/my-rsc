const express = require("express")
const { readFileSync } = require("fs")
const path = require("path")
const serialize = require("./serialize").default

import renderServerComponent from './renderServerComponent'
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

// Возвращаем на клиент отрендеренные компоненты в виде сериализованного json.
app.get("/payload", async (req, res) => {
    const json = await ReactApp();

    const str = serialize(renderServerComponent(json));

    res.send(str);
})

// Рендер асинхронных серверных компонентов
app.get('/getAsyncServerComponent/:name', async (req, res) => {
    const Component = require(path.join(
        __dirname,
        `../components/${req.params.name}.js`
    )).default

    const json = await Component();

    const str = serialize(renderServerComponent(json));

    res.send(str);
})

app.get("/stream", async (req, res) => {
    const json = await ReactApp();

    renderToPipeableStream(json, res);
});

app.listen(PORT, () => {
    console.log(`App is live at http://localhost:${PORT}`);
});
