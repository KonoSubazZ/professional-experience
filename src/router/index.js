import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import( '../components/common/Container.vue'),
        icon: 'el-icon-lx-home',
        name: "home",
        redirect: '/index',
        meta: { title: '' },
        children: [
            {
                path: '/index',   //首页
                name: 'index',
                component: () => import('../components/views/home/index.vue')
            },
            {
                path: '/borrow',   //借书
                name: 'borrow',
                component: () => import('../components/views/borrow/index.vue')
            },
            {
                path: '/return',    //还书
                name: 'return',
                component: () => import('../components/views/return/index.vue')
            },
            {
                path: '/myBorrow',     //我的借阅
                name: 'myBorrow',
                component: () => import('../components/views/myBorrow/index.vue')
            },
            {
                path: '/myBorrowDetail',     //我的借阅详情
                name: 'myBorrowDetail',
                component: () => import('../components/views/myBorrow/myBorrow.vue')
            },
            {
                path: '/managerDown',    //管理员上架
                name: 'managerDown',
                component: () => import('../components/views/manager/index.vue')
            },
            {
                path: '/managerBook',    //管理员盘点书
                name: 'managerBook',
                component: () => import('../components/views/manager/managerBook.vue')
            },
            {
                path: '/bookDetail',    //图书详情
                name: 'bookDetail',
                component: () => import('../components/views/bookDetail.vue')
            },
            {
                path: '/login',    //登录
                name: 'login',
                component: () => import('../components/views/login/index.vue')
            },
        ]
    },
    {
        path:'/setting',      //配置页面
        name:'setting',
        component: () => import('../components/views/setting.vue')
    },
    {
        path:'/standby',      //待机页面
        name:'standby',
        component: () => import('../components/views/standby/index.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
const list = ['/borrow','/return','/myBorrow']
import { ElMessage } from 'element-plus'
router.beforeEach((to, from, next) => {
    console.log(to.path,'-----要去的页面-----');
    if(to.path === '/setting') return next();
    if ((!sessionStorage.getItem('user') || sessionStorage.getItem('user')==='{}') && list.includes(to.path)){
        // ElMessage.error('请先登录');
        // next('/login');
    }else if(!localStorage.getItem('http')){
        next('/setting');
    }else{
        next();
    }
})

export default router;
