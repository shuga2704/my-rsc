import deserialize from "../framework/deserialize";

const Posts = {
    data: null,
    promise: null,
    fetch() {
        if (this.data) {
            return this.data;
        }

        if (this.promise === null) {
            const payload = {
                component: "PostList",
                props: {},
            };

            this.promise = fetch("/render", {
                body: JSON.stringify(payload),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.text())
                .then((str) => {
                    this.data = deserialize(str);
                });
        }

        throw this.promise;
    },
};

export default function PostList() {
    return Posts.fetch();
}
