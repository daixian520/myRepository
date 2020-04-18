// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  try{
    var count = await db.collection('db_window').where({
      time: {
        $regex: event.time
      }
    }).count()
    var count2 = await db.collection('db_window').where(_.and([{
      time: {
        $regex: event.time
      }
    },
    {
      _id: {
        $regex: event.regex
      }
    }
    ])).count()
    return {
      count:count,
      count2:count2
    }
  }
  catch(e){
    console.error()
  }
  
}