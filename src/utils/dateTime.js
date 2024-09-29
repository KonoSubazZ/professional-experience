const date = {
    dateFormatALL(time) {
        let date=new Date(time);
        let year=date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    dateFormatHours(time) {
        let date=new Date(time);
        let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        return hours+":"+minutes;
    },
    dateFormatDay(time) {
        let date=new Date(time);
        let year=date.getFullYear();
        let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        return year+"年"+month+"月"+day+'日';
    },
}
export default date