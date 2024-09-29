import Vue from "vue";
import Router from "vue-router";
import borrowPortrait from "./borrowPortrait"
Vue.use(Router);
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((error) => error);
};

const router = new Router({
    routes: [{
        path: "/",
        name: "landing-page",
        component: require("@/components/views/home").default,
    },
    {
        path: "/stopUse",
        name: "stopUse",
        component: require("@/components/views/stopUse/stopUse").default
    },
    {
        path: "/doorSetting",
        name: "doorSetting",
        component: require("@/components/views/door/setting").default
    },
    {
        path: "/editCode",
        name: "editCode",
        component: require("@/components/views/getCard/editCode/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "editCode",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
            meta: {
                type: "getCard",
            },
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
        },
        {
            path: "code",
            name: "code",
            component: require("@/components/views/getCard/editCode/code")
                .default,
        },
        ],
    },
    {
        path: "/payment",
        name: "/payment",
        component: require("@/components/views/getCard/payment/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "payment",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
        },
        {
            path: "deno",
            name: "deno",
            component: require("@/components/views/getCard/payment/deno").default,
        },
        {
            path: "payment",
            name: "payment",
            component: require("@/components/views/getCard/payment/payment")
                .default,
        },
        {
            path: "password",
            name: "password",
            component: require("@/components/views/common/password").default,
        },
        ],
    },
    {
        path: "/getCardSearch",
        name: "/getCardSearch",
        component: require("@/components/views/getCard/search/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "getCardSearch",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
        },
        {
            path: "password",
            name: "password",
            component: require("@/components/views/common/password").default,
        },
        {
            path: "peopleInfo",
            name: "peopleInfo",
            component: require("@/components/views/getCard/search/info").default,
        },
        ],
    },
    {
        path: "/getCard",
        name: "getCard",
        component: require("@/components/views/getCard/getCard/index").default,
        children: [{
            path: "",
            name: "idCard",
            component: require("@/components/views/getCard/getCard/idCard")
                .default,
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/getCard/getCard/face").default,
        },
        {
            path: "info",
            name: "info",
            component: require("@/components/views/getCard/getCard/info").default,
        },
        {
            path: "pay",
            name: "pay",
            component: require("@/components/views/getCard/getCard/pay").default,
        },
        {
            path: "success",
            name: "success",
            component: require("@/components/views/getCard/getCard/success")
                .default,
        },
        ],
    },
    {
        path: "/overduce",
        name: "overduce",
        component: require("@/components/views/overduce/index").default,
        children: [{
            path: "",
            name: "overduce",
            component: require("@/components/views/common/overduce").default,
        },],
    },
    {
        path: "/search",
        name: "search",
        component: require("@/components/views/search/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "password",
            name: "password",
            component: require("@/components/views/common/password").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "projects",
            name: "projects",
            component: require("@/components/views/common/selectProjects")
                .default,
            meta: {
                type: "search",
            },
        },
        {
            path: "peopleInfo",
            name: "peopleInfo",
            component: require("@/components/views/common/peopleInfo").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "borrowHistory",
            name: "borrowHistory",
            component: require("@/components/views/common/borrowHistory").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "currentBorrow",

            name: "currentBorrow",
            component: require("@/components/views/common/currentBorrow").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "fingerprintAuth",
            name: "fingerprintAuth",
            component: require("@/components/views/common/fingerprintAuth").default,
            meta: {
                type: "search",
            },
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
            meta: {
                type: "search",
            },
        },
        ],
    },
    {
        path: "/renew",
        name: "renew",
        component: require("@/components/views/renew/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "password",
            name: "password",
            component: require("@/components/views/common/password").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "fingerprintAuth",
            name: "fingerprintAuth",
            component: require("@/components/views/common/fingerprintAuth").default,
            meta: {
                type: "renew",
            },
        },
        {
            path: "select",
            name: "select",
            component: require("@/components/views/common/renewBook").default,
            meta: {
                type: "renew",
            },
        },
        ],
    },
    {
        path: "/return",
        name: "return",
        component: require("@/components/views/return/index").default,
        children: [{
            path: "",
            name: "book",
            component: require("@/components/views/common/readBook").default,
            meta: {
                type: "return",
            },
        },
        {
            path: "info",
            name: "info",
            component: require("@/components/views/common/info").default,
            meta: {
                type: "return",
            },
        },
        ],
    },
    {
        path: "/borrow",
        name: "borrow",
        component: require("@/components/views/borrow/index").default,
        children: [{
            path: "",
            name: "type",
            component: require("@/components/views/common/type").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "face",
            name: "face",
            component: require("@/components/views/common/faceAuth").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "book",
            name: "book",
            component: require("@/components/views/common/readBook").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "info",
            name: "info",
            component: require("@/components/views/common/info").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "card",
            name: "card",
            component: require("@/components/views/common/readCard").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "password",
            name: "password",
            component: require("@/components/views/common/password").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "idCard",
            name: "idCard",
            component: require("@/components/views/common/idCard").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "codeAuth",
            name: "codeAuth",
            component: require("@/components/views/common/codeAuth").default,
            meta: {
                type: "borrow",
            },
        },
        {
            path: "fingerprintAuth",
            name: "fingerprintAuth",
            component: require("@/components/views/common/fingerprintAuth").default,
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
            component: require("@/components/borrow/book/overdue").default,
            meta: {
                type: "borrow",
            },
        },
        ],
    },
    {
        path: "/portrait",
        name: "portrait",
        component: require("@/components/common/routePage").default,
        children: borrowPortrait,
    },
    {
        path: "/service",
        name: "service",
        component: require("@/components/views/setting/service").default,
    },
    {
        path: "/password",
        name: "password",
        component: require("@/components/views/setting/password").default,
    },
    {
        path: "/ceshi",
        name: "ceshi",
        component: require("@/components/views/setting/ceshi.vue").default,
    },
    {
        path: "*",
        redirect: "/",
    },
    ],
});
router.beforeEach((to, from, next) => {
    // store.commit("set_label_name", "type");
    next();
})
export default router;