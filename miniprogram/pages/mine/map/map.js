// miniprogram/pages/mine/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "../../images/star.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{}]
  },
  no: function() {
    wx.showToast({
      title: '有待升级',
    })
  },
  regionchange(e) {
   
  },
  markertap(e) {
  
  },
  controltap(e) {
    
  },

  fanhui: function() {
    var mp = wx.createMapContext("map");
    mp.moveToLocation();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})