Page({
  /**
   * 页面的初始数据
   */
 data:{
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   authorize:'',
   openid: '',
 },
  onLoad: function () {
    var that=this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //用户已经授权过
              that.setData({
                authorize:true
              })
            }
          })
        }
      }
    })
  },
  /**返回按钮事件 */
  
  bindGetUserInfo: function (e) {
    var that=this
    
    if (e.detail.userInfo) {
      this.getOpenid()
      that.setData({
        authorize: true
      })
    } else {
      that.setData({
        authorize: false
      })
    }
  },

  //进入地图
  gomap:function(){
    wx.navigateTo({
      url: './map/map',
    })
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // console.log('云函数获取到的openid: ', res.result.openid)
        var openid = res.result.openid;
        wx.setStorageSync('openid', openid)
        that.setData({
          openid: openid
        })
      }
    })
  },
  skip_fav() {
    wx.navigateTo({
      url: '../list/list',
    })
  }
})