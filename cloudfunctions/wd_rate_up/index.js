// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
//云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('db_window').doc(event.id).update({
      data:{
        rate:event.rate
      }
    })
  }
  catch (e) {
    console.error(e)
  }
}
