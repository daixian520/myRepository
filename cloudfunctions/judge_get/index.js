// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
//云函数入口函数
exports.main = async(event, context) => { 
  try {
    var totalcount =await  db.collection('db_judge').where({
      w_id: event.id
    }).count()
    var times=totalcount.total/100
    if(times!=0){
       times = Math.ceil(totalcount.total / 100) 
    }
    var result = [];
    for(var i=0;i<=times;i++){
      query = await db.collection('db_judge').orderBy('p_time', 'desc').limit(100).skip(100 * i).where({
        w_id: event.id
      }).get()
      result=result.concat(query.data)
    }
    return{
     result:result
    }
  } catch (e) {
    console.error(e)
  }
}