var app = getApp();
var time = require('../../utils/time');
Page({
  data: {
    lists: [],
    showView: false,
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function () {
    // for (var i = 0; i < 10; i++) {
    //   this.data.lists.push({
    //     content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
    //   })
    // }
    // this.setData({
    //   lists: this.data.lists
    // })
    initData(this);
  },
  onShow: function () {
    initData(this);
  },
  //编辑事件，跳转到add页面
  edit(e) {
    var id = e.currentTarget.dataset.id;
    // 跳转 navigateTo
    wx.navigateTo({
      url: '../add/add?id=' + id
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.lists.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      lists: this.data.lists
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.lists.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      lists: that.data.lists
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //添加
  add(e) {
    wx.navigateTo({
      url: '../add/add',
    })
  },

  //删除事件
  del: function (e) {
    this.data.lists.splice(e.currentTarget.dataset.index, 1)
    wx.setStorageSync('txt', this.data.lists)
    this.setData({
      lists: this.data.lists
    })
  },

})
function initData(page) {
  var arr = wx.getStorageSync('txt');
  if (arr.length) {
    arr.forEach((item, i) => {
      var t = item.time;
      item.time = time.date_time(t);
    })
    page.setData({
      lists: arr,
      showView: false
    })
  } else {
    page.setData({
      showView: true
    });
  }
}