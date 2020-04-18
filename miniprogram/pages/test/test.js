// miniprogram/pages/test/test.js
const Charts = require('../../utils/wxcharts.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  color:['orange','green','gray']
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that=this;
    var regex="^.1"
    wx.cloud.callFunction({
      name: 'get_wd_by_time',
      data: {
        time:'晚',
        regex: regex,
        type:'filter'
      },
      success: res => {
        console.log('time',res)
      }
    })

  wx.cloud.callFunction({
    name:'hh',
    data:{
      time:'早',
      regex:'^12'
    },
    success:res=>{
      console.log(res)
      console.log('success')
    },
  fail:res=>{
  console.log(res)
  }
  })




    // wx.cloud.callFunction({
    //   name: 'wd_rate_up',
    //   data: {
    //     id: '11102',
    //     rate: 80
    //   },
    //   success: res => {
    //     console.log(res)
    //     // console.log(that.data.goodpingjia)
    //     // console.log(res.result)
    //   },
    //   fail: res => {
    //     console.log(res)
    //   }
    // })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})