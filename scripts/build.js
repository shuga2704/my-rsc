const babel = require("@babel/core");
const { rollup } = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("rollup-plugin-replace");
const fs = require("fs");
const path = require("path");
const html = require("@rollup/plugin-html");

const dir_src = path.resolve(__dirname + "/../src/");
const dir_built = path.resolve(__dirname + "/../built/");
const dir_public = path.resolve(__dirname + "/../public/");
const dir_components_src = path.resolve(__dirname + "/../src/components/");
const dir_components_built = path.resolve(__dirname + "/../built/components/");

// Транспилируем исходники
function transpile() {
    const files = getFilesRecursive(dir_src).filter((file) => /jsx?$/.test(file));

    for (const file of files) {
        const content = fs.readFileSync(file, {
            encoding: "utf-8",
        });

        const { code } = babel.transformSync(content);

        const dest_file = file
            .replace(dir_src, dir_built)
            .replace(/\.jsx?$/, ".js");
        writeFileSync(dest_file, code);
    }
}

async function buildForClient() {
    const { serverComponents, clientComponents } = await readAllComponents();

    const bundle = await rollup({
        input: [
            dir_built + "/index.js",
            ...clientComponents.map(
                (component) =>
                    dir_built + "/components/" + component.fileName.split(".")[0] + ".js"
            ),
        ],
        plugins: [
            replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
            commonjs(),
            nodeResolve(),
            html({
                title: "My RSC",
                template: ({ attributes, files, meta, publicPath, title }) => {
                    const scripts = (files.js || [])
                        .filter((file) => /react|index/.test(file.fileName))
                        .map(({ fileName }) => {
                            const attrs = makeHtmlAttributes(attributes.script);
                            return `<script src="${publicPath}${fileName}"${attrs}></script>`;
                        })
                        .join("\n");

                    const metas = meta
                        .map((input) => {
                            const attrs = makeHtmlAttributes(input);
                            return `<meta${attrs}>`;
                        })
                        .join("\n");

                    return `
                        <!doctype html>
                        <html${makeHtmlAttributes(attributes.html)}>
                          <head>
                          <style>
                          * {
                            font-family: sans-serif;
                          }
                          #root {
                            padding: 1rem;
                            background-color: #eee;
                            margin-top: 1rem;
                          }
                          </style>
                            ${metas}
                            <title>${title}</title>
                          </head>
                          <body>
                          <div id="root"></div>
                            ${scripts}
                          </body>
                        </html>
                    `;
                },
            }),
        ],
    });

    await bundle.write({
        format: "es",
        manualChunks: {
            react: ["react"],
            "react-dom": ["react-dom"],
        },
        dir: __dirname + "/../public",
    });
}

// Карта компонентов
async function generateComponentMap() {
    const { serverComponents, clientComponents } = await readAllComponents();

    writeFileSync(
        dir_built + "/utils/componentMap.js",
        `
                    module.exports =  {
                        serverComponents: [${serverComponents
                            .map((file) => `"${file.fileName.split(".")[0]}"`)
                            .join(",")}],
                        clientComponents: [${clientComponents
                            .map((file) => `"${file.fileName.split(".")[0]}"`)
                            .join(",")}, "LazyContainer"],
                    }
                `
    );
}

async function start() {
    removeBuiltFiles();

    transpile();

    await buildForClient();

    transpile();

    await generateComponentMap();
}

start();

// Утилиты

function removeBuiltFiles() {
    deleteFilesRecursive(dir_built);
    deleteFilesRecursive(dir_public);
}

function deleteFilesRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);

            if (fs.statSync(filePath).isDirectory()) {
                deleteFilesRecursive(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

function getFilesRecursive(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFilesRecursive(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function makeHtmlAttributes(attributes) {
    if (!attributes) {
        return "";
    }

    const keys = Object.keys(attributes);
    // eslint-disable-next-line no-param-reassign
    return keys.reduce(
        (result, key) => (result += ` ${key}="${attributes[key]}"`),
        ""
    );
}

function writeFileSync(filePath, content, charset = "utf-8") {
    const dirname = path.dirname(filePath);

    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(filePath, content, { encoding: charset });
}


async function readAllComponents() {
    const allComponents = await new Promise((resolve, reject) => {
        fs.readdir(dir_components_src, (err, files) => {
            if (err == null) {
                resolve(files);
            } else {
                reject(err);
            }
        });
    });

    const serverComponents = [];
    const clientComponents = [];

    allComponents.forEach((file) => {
        const content = fs.readFileSync(dir_components_src + "/" + file, {
            encoding: "utf-8",
        });

        if (content.includes("use client")) {
            clientComponents.push({
                fileName: file,
                content,
            });
        } else {
            serverComponents.push({
                fileName: file,
                content,
            });
        }
    });

    return {
        serverComponents,
        clientComponents,
    };
}
