export default {
    mapKey(keyCode,fun){
        document.onkeydown = (e)=>{
            let key = e.key
            // console.log(e)
            if(keyCode == key){
                fun()
            }
        };
    },
}