import { createRouter, createWebHashHistory } from 'vue-router';
import { ElMessage } from 'element-plus'
const routes: any = [
    { path: '/', redirect: '/Index' },
    { path: '/Index', component: () => import('../views/index.vue') },
    { path: '/setting', component: () => import('../views/setting.vue') },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to, _, next) => {
    // 如果没有配置就跳转到配置页
    console.log(to.path, '--to.path--');

    if ((to.path !== '/setting') && !window.localStorage.getItem('setting')) {
        next('/setting')
        console.log('配置页进来了');


        ElMessage.warning('请先配置大数据地址')
    } else {
        next()
    }

    console.log(window.location, '--href--');

})
export default router;