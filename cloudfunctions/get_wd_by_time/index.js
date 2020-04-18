// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var count = await db.collection('db_window').where({
      time: {
        $regex: event.time
      }
    }).count()
    var resule = await db.collection('db_window').where({
      time: {
        $regex: event.time
      }
    }).get()
    var count2 = await db.collection('db_window').where(_.and([{
      time: {
        $regex: event.time
      }
      },
      {
        _id: {
          $regex:event.regex
        }
      }
      ])).count()
    var result2 = await db.collection('db_window').where(_.and([{
      time: {
        $regex: event.time
      }
    },
    {
      _id: {
        $regex: event.regex
      }
    }
    ])).get()
    if(event.type==='button'){
      return {
        result: resule,
        count: count
      }
    }
    else if(event.type==='filter'){
      return{
        result: result2,
        count: count2
      }
    }
    else{
     return {
       result:hah
     }
    }
  
}
catch (e) {
  console.error(e)
}
}