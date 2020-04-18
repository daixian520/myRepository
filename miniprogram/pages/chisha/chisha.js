// pages/chisha/chisha.js
const app = getApp();
const Util = require('../../utils/util.js')
const Time = require('../../utils/time.js')
const db = wx.cloud.database();
const _ = db.command;
// const q=db.collection('db_window')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    w_label: '米饭',
    tishi: '',
    imagewidth: 0, //小程序缩放后的宽 
    imageheight: 0, //小程序缩放后的高 
    showView: true,
    showmore: true,
    monthlySale: 4000,
    max: 10, //一次加载条数
    queryResult: [], //查询的值
    currenttime: 0, //当前第几次加载
    multiArray: [
      ['全部', '杏苑', '橘井'],
      ['全部', '一楼', '二楼', '三楼'] //给picker赋初始值
    ],
    multiIndex: [0, 0],
    sousuoValue: null,
  },
  imageLoad: function(e) {
    var imageSize = Util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight,
    })
  },
  /**标签的收起和展开 */
  showButton: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
    })
  },
  showInput: function(e) {
    this.setData({
      inputShowed: true,
    });

  },
  gotime: function(e) {
    var that = this;
    wx.showLoading({
      title: '美食正在加载中...',
    })
    var time = e.currentTarget.dataset.value.substring(0, 1);
    if (time == '午') {
      time = '中'
    }
    if (time == '未') {
      time = '晚'
      wx.showToast({
        title: '未到营业时间',
      })
      return
    }
    that.setData({
      time: time,
    })
    wx.cloud.callFunction({
      name: 'get_wd_by_time',
      data: {
        time: time,
        type: 'button'
      },
      success: res => {
        wx.hideLoading()
        if (res.result != null) {
          that.setData({
            queryResult: res.result.result.data,
            w_count: res.result.count.total,
            multiIndex: [0, 0],
            timefunction: true,
            showView: true,
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
        })
      }
    })
  },

  //input绑定事件
  navto: function(e) {
    wx.navigateTo({
      url: '../sousuo/sousuo'
    })
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      multiIndex: [0, 0]
    })
    var now = new Date();
    now = Time.data_hour(now)
    this.setData({
      nowtime: now
    })
    that.query();
    db.collection('db_window').orderBy('rate', 'desc').limit(10).get({
      success: res => {
        that.setData({
          tuijian: res.data,
        })
      },
      fail: res => {
        // console.log(res)
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
  /**每次页面出现都会执行查询 */
  onShow: function() {
    /** 获取app转盘数据 如果有值且不为空进行data设置 */
    /**有问题因为每次跳转回来都要执行onshow然后重新给data赋值，而不是原来选择的值 */ //已解决
    var that = this;
    var label = app.globalData.label;
    //如果标签没变或者为空则不触发搜索
    if (label && label != null && that.data.w_label != label) {
      this.setData({
        w_label: label
      })
      that.query();
      // that.hideInput();
    }
  },
  /**普通标签查询 */
  query: function() {
    var that = this;
    var max = that.data.max;
    wx.showLoading({
      title: '美食正在加载中....',
      // mask:true
    })
    db.collection('db_window').where({
      label: {
        $regex: that.data.w_label,
      }
    }).count({
      success: res => {
        that.setData({
          w_count: res.total,
          /**计算总共需要几次 */
          w_times: Math.floor(res.total / max),

        })
      },
      fail: res => {
        Util.networkfail();
      }
    })
    db.collection('db_window').where({
      label: {
        $regex: that.data.w_label
      }
    }).limit(that.data.max).get({
      success: res => {
        wx.hideLoading()
        that.setData({
          tishi: that.data.w_label,
          queryResult: res.data,
          currenttime: 0
        })
      },
      fail: res => {
        Util.networkfail();
      }
    })


  },
  /**picker列改变级联事件 */
  bindMultiPickerColumnChange(e) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['全部', '一楼', '二楼', '三楼']
            break
          case 1:
            data.multiArray[1] = ['全部', '一楼', '二楼', '三楼']
            break
          case 2:
            data.multiArray[1] = ['全部', '一楼', '二楼']
            break
        }
        data.multiIndex[1] = 0
        break
    }
    this.setData(data)
  },
  /**picker值改变事件 */
  bindMultiPickerChange(e) {
    var that = this;
    that.setData({
      multiIndex: e.detail.value
    })
    var cloumn1 = e.detail.value[0], //取picker第一列的值
      cloumn2 = e.detail.value[1], //取picker第二列的值
      iflabel = that.data.w_label; //取搜索标签的值
    if (e.detail.value[0] == 0) {
      cloumn1 = '.'
    } else {
      cloumn1 = cloumn1.toString()
    }
    if (e.detail.value[1] == 0) {
      cloumn2 = ''
    } else {
      cloumn2 = cloumn2.toString()
    }
    that.setData({ //为query提供搜索条件
      cloumn1: cloumn1,
      cloumn2: cloumn2,
      iflabel: iflabel
    })
    var regex = '^' + cloumn1 + cloumn2
    if (!that.data.timefunction) {
      this.query2();
    } else {
      wx.cloud.callFunction({
        name: 'get_wd_by_time',
        data: {
          time: that.data.time,
          type: 'filter',
          regex: regex
        },
        success: res => {
          if (res.result != null) {
            that.setData({
              queryResult: res.result.result.data,
              w_count: res.result.count.total,
            })
          }
        }
      })
    }
  },
  /**关联查询事件 */
  query2: function() {
    var that = this;
    var wlabel = that.data.w_label;
    var max = that.data.max
    wx.showLoading({
      title: '加载中',
    })
    //以下分支代表1没有标签选择和搜索框选择，2进行标签关联，3进行搜索框关联查询分别进行计算总条数和skip查询
    if (!that.data.iflabel) {
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).count({
        success: res => {
          that.setData({
            w_count: res.total,
            /**计算总共需要几次 */
            w_times: Math.floor(res.total / max)
          })
        },
        fail: res => {
          Util.networkfail();
        }
      })
    } else {
      db.collection('db_window').where(_.and([{
          label: {
            $regex: that.data.w_label
          }
        },
        {
          _id: {
            $regex: '^' + that.data.cloumn1 + that.data.cloumn2
          }
        }
      ])).count({
        success: res => {
          that.setData({
            w_count: res.total,
            /**计算总共需要几次下同 */
            w_times: Math.floor(res.total / max)
          })
        },
        fail: res => {
          Util.networkfail()
        }
      })
    }

    /**如果搜索框和label的值都为空，则只匹配位置 */
    if (!that.data.iflabel) {
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).limit(that.data.max).skip(0).get({
        success: res => {
          wx.hideLoading()
          that.setData({
            queryResult: res.data,
            currenttime: 0
          })
        },
        fail: res => {
          Util.networkfail();
        }
      })
    }
    /**如果label不为为空则搜索的值为label的关联过滤*/
    else {
      db.collection('db_window').where(_.and([{
          label: {
            $regex: that.data.w_label
          }
        },
        {
          _id: {
            $regex: '^' + that.data.cloumn1 + that.data.cloumn2
          }
        }
      ])).limit(that.data.max).skip(0).get({
        success: res => {
          wx.hideLoading()
          that.setData({
            queryResult: res.data,
            currenttime: 0
          })
        },
        fail: res => {
          Util.networkfail();
        }
      })
    }
  },
  /**底部触发查询。结果用concat连接 */
  query3: function() {
    var that = this;
    if (!that.data.iflabel) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).count({
        success: res => {
          that.setData({
            w_count: res.total,
            /**计算总共需要几次 */
            w_times: Math.floor(res.total / max)
          })
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('db_window').where(_.and([{
          label: {
            $regex: that.data.w_label
          }
        },
        {
          _id: {
            $regex: '^' + that.data.cloumn1 + that.data.cloumn2
          }
        }
      ])).count({
        success: res => {
          that.setData({
            w_count: res.total,
            /**计算总共需要几次下同 */
            w_times: Math.floor(res.total / max)
          })
        }
      })
    }

    /**如果label的值为空，则只匹配位置 */
    if (!that.data.iflabel) {
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).limit(that.data.max).skip(that.data.currenttime * that.data.max).get({
        success: res => {
          wx.hideLoading()
          that.setData({
            queryResult: that.data.queryResult.concat(res.data)
          })
        },
        fail: res => {
          Util.networkfail();
        }
      })
    }
    /**如果label不为为空则搜索的值为label的关联过滤*/
    else {
      db.collection('db_window').where(_.and([{
          label: {
            $regex: that.data.w_label

          }
        },
        {
          _id: {
            $regex: '^' + that.data.cloumn1 + that.data.cloumn2
          }
        }
      ])).limit(that.data.max).skip(that.data.currenttime * that.data.max).get({
        success: res => {
          wx.hideLoading()
          that.setData({
            queryResult: that.data.queryResult.concat(res.data)
          })
        },
        fail: res => {
          Util.networkfail()
        }
      })
    }
  },

  /**标签的点击事件 */
  golabel: function(e) {
    var golabel = e.currentTarget.dataset.btn;
    this.setData({
      showView: true,
      timefunction: false
    })
    if (golabel == '全部') {
      golabel = '.*?'
    }
    /**如果标签值改变且不为空才会再次触发 */
    if (golabel != null && golabel != this.data.w_label) {
      this.setData({
        w_label: golabel,
        // sousuoValue: ''
      })
      app.globalData.label = golabel
      this.query();
      this.setData({
        multiIndex: [0, 0]

      })
    }
  },
  gowindow: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../window-info/window-info?id=' + id
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.onLoad();
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1500)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var currenttime1 = that.data.currenttime;
    if (!that.data.timefunction) {
      if (currenttime1 >= that.data.w_times) {
        that.setData({
          showmore: false
        })
        wx.showToast({
          title: '我是有底线的',
        })
      } else {
        that.setData({
          showmore: true
        })
        var mutiindex = that.data.multiIndex;
        var cloumn1 = mutiindex[0], //取picker第一列的值
          cloumn2 = mutiindex[1], //取picker第二列的值
          iflabel = that.data.w_label; //取搜索标签的值
        if (mutiindex[0] == 0) {
          cloumn1 = '.'
        }
        if (mutiindex[1] == 0) {
          cloumn2 = ''
        }
        that.setData({ //为query提供搜索条件
          cloumn1: cloumn1,
          cloumn2: cloumn2,
          iflabel: iflabel,
          currenttime: currenttime1 + 1
        })
        that.query3();
      }
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})