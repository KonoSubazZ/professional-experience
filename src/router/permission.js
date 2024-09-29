import router from './index'
import bus from '../components/common/bus'
let permissions = []
let whiteList = ["/403", "/login", "/dashbaord", "/404", "/activationSelect", "/activationOL", "/activation", "/print", "/loginAlone", '/printClass', '/singleVisionLogin']
bus.$on("allowMenu", (e) => {
    // // console.log(e)
    permissions = []
    // if(e&& e[0] && e[0].subs){
    // e.map(it=>{
    //     if(it.subs.length>0){
    //         it.subs.map(item=>{
    //             permissions.push(item.index)
    //             // console.log(permissions)
    //         })
    //     }
    // })

    // // console.log(permissions)
    if (e && e[0]) {
        e[0].subs.forEach(item => {
            permissions.push(item.index)
            // // console.log(permissions)

        });
    }
})

router.beforeEach((to, from, next) => {
    // // console.log(to.path)
    let user = ''
    try {
        user = JSON.parse(localStorage.getItem("user"))
    } catch (error) {

    }

    if (to.path == '/login' || to.path == '/loginAlone' || to.path == '/loginAll') {
        next()
        return
    }

    if (to.path == '/activation' || to.path == '/singleVisionLogin' || to.path == '/activationSelect') {
        next()
        return
    }
    if (to.path == '/activationOL') {
        next()
        return
    }
    if (user && user.info && user.info.type == 'SUPER_MANAGER') {
        next()
        return
    }
    if (!user) {
        next({ path: "/login" })
        return
    }
    if (to.path == '/' || to.path == '/index' || to.path == '/subIndex') {

        next()
        return
    }

    if (whiteList.indexOf(to.path) > -1) {
        next()
        return
    }
    if (permissions.indexOf(to.path) == -1) {
        next()
        // next({path:"*"})
        return
    }
    next()

})