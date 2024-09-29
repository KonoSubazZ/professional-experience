let routes = [
    {
        path: "search",
        name: "search",
        component: require("@/components/views/borrowPortrait/search/index").default,
        children: [
            {
                path: "",
                name: "type",
                component: require("@/components/views/common/portrait/type")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "password",
                name: "password",
                component: require("@/components/views/common/portrait/password")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "projects",
                name: "projects",
                component: require("@/components/views/common/portrait/selectProjects")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "peopleInfo",
                name: "peopleInfo",
                component: require("@/components/views/common/portrait/peopleInfo")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "borrowHistory",
                name: "borrowHistory",
                component: require("@/components/views/common/portrait/borrowHistory")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "currentBorrow",
                name: "currentBorrow",
                component: require("@/components/views/common/portrait/currentBorrow")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "face",
                name: "face",
                component: require("@/components/views/common/portrait/faceAuth")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "idCard",
                name: "idCard",
                component: require("@/components/views/common/portrait/idCard")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "codeAuth",
                name: "codeAuth",
                component: require("@/components/views/common/portrait/codeAuth")
                    .default,
                meta: {
                    type: "search",
                },
            },
            {
                path: "card",
                name: "card",
                component: require("@/components/views/common/portrait/readCard")
                    .default,
                meta: {
                    type: "search",
                },
            },
        ],
    },
    {
        path: "renew",
        name: "renew",
        component: require("@/components/views/borrowPortrait/renew/index").default,
        children: [
            {
                path: "",
                name: "type",
                component: require("@/components/views/common/portrait/type")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "password",
                name: "password",
                component: require("@/components/views/common/portrait/password")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "face",
                name: "face",
                component: require("@/components/views/common/portrait/faceAuth")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "idCard",
                name: "idCard",
                component: require("@/components/views/common/portrait/idCard")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "codeAuth",
                name: "codeAuth",
                component: require("@/components/views/common/portrait/codeAuth")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "card",
                name: "card",
                component: require("@/components/views/common/portrait/readCard")
                    .default,
                meta: {
                    type: "renew",
                },
            },
            {
                path: "select",
                name: "select",
                component: require("@/components/views/common/portrait/renewBook")
                    .default,
                meta: {
                    type: "renew",
                },
            },
        ],
    },
    {
        path: "return",
        name: "return",
        component: require("@/components/views/borrowPortrait/return/index").default,
        children: [
            {
                path: "",
                name: "book",
                component: require("@/components/views/common/portrait/readBook")
                    .default,
                meta: {
                    type: "return",
                },
            },
            {
                path: "info",
                name: "info",
                component: require("@/components/views/common/portrait/info")
                    .default,
                meta: {
                    type: "return",
                },
            },
        ],
    },
    {
        path: "borrow",
        name: "borrow",
        component: require("@/components/views/borrowPortrait/borrow/index").default,
        children: [
            {
                path: "",
                name: "type",
                component: require("@/components/views/common/portrait/type")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "face",
                name: "face",
                component: require("@/components/views/common/portrait/faceAuth")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "book",
                name: "book",
                component: require("@/components/views/common/portrait/readBook")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "info",
                name: "info",
                component: require("@/components/views/common/portrait/info")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "card",
                name: "card",
                component: require("@/components/views/common/portrait/readCard")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "password",
                name: "password",
                component: require("@/components/views/common/portrait/password")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "idCard",
                name: "idCard",
                component: require("@/components/views/common/portrait/idCard")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "codeAuth",
                name: "codeAuth",
                component: require("@/components/views/common/portrait/codeAuth")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "bookInfo",
                name: "bookInfo",
                component: require("@/components/borrow/book/info").default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "read",
                name: "read",
                component: require("@/components/borrow/book/read").default,
                meta: {
                    type: "borrow",
                },
            },
            {
                path: "overdue",
                name: "overdue",
                component: require("@/components/borrow/book/overdue")
                    .default,
                meta: {
                    type: "borrow",
                },
            },
        ],
    }
]
export default routes