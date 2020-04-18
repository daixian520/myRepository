function date_time(val) {
   var date = new Date(val);
  //月份为0-11，所以+1，月份小于10时补个0
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second = date.getSeconds();
  var theTime = date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + minute + ":" + second;
  return theTime
}
function data_hour(val){
  var date = new Date(val);
  var hour =date.getHours();
   hour = Number(hour);
   if(hour>=6&&hour<=9){return '早餐窗口'}
  else if(hour<=15){return '午餐窗口'}
  else if(hour<=20){return '晚餐窗口'}
  else{return '未到营业时间'}
}
module.exports = {
  date_time:date_time,
  data_hour:data_hour
}