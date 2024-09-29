
// let url ='http://librarycluster.longpeng.dev.cq1080.com/'
//let url='http://192.168.10.102:8003/'
// let url='http://192.168.1.6:8003'   //2022.5.23更改  
// let url='http://192.168.11.111:8003'   //2022.7.30更改地址
// let url='http://192.168.10.188:8003/'
// let url='http://125.76.158.113:8001/'
// let url='http://192.168.10.107:8003/'
// let url='http://library.yx.dev.cq1080.com'
// let url='http://192.168.10.114:8003'
// let url='https://library.bwlib.cn'
let url = 'http://192.168.13.7:8003'; //2024.1.2更改地址
// let = url='https://bdhxq.bwlib.cn/'
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        disableHostCheck:true,
        port: 8009,
        open:true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
          },
        proxy: {
            '/manage/*':{
                 target:url,
                secure: false,
                changeOrigin:true
            },
            '/offlineBorrow/*':{
                target:url,
               secure: false,
               changeOrigin:true
           },
            '/order/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                // target:'http://192.168.10.131:8003/',
                secure: false,
                changeOrigin:true
            },
            '/login/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                // target:'http://192.168.10.131:8003/',
                secure: false,
                changeOrigin:true
            },
            '/image/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                // target:'http://192.168.10.131:8003/',
                secure: false,
                changeOrigin:true
            },
            '/excel/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                // target:'http://192.168.10.131:8003/',
                secure: false,
                changeOrigin:true
            },
            '/other/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false, 
                changeOrigin:true
            },
            '/common/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            },
            '/export/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            },
            '/import/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            },
            '/api/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            },
            '/hardware/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            },
            '/applets/*':{
                // target:'http://librarycluster.longpeng.dev.cq1080.com/',
                target:url,
                secure: false,
                changeOrigin:true
            }
        }
   }

}