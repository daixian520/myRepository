// pages/window-info/window-info.js
const Charts = require('../../utils/wxcharts.js')

var Size = require('../../utils/size.js')
var Time = require('../../utils/time.js')
var Utils = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageheight: 0, //图片的原始高
    imagewidth: 0,
    winWidth: 0,
    winHeight: 0,
    color: ['#FF9B5A', '#CD9B32', '#FF9B32'],
    w_id: '12106', //默认窗口名
    w_name: '', //窗口名
    w_describe: '', //窗口介绍
    w_menu: [], //窗口菜单数组
    w_locate: '', //窗口位置
    currentTab: 0, // tab切换  
    evaluate_contant: ['窗口环境', '饭菜口味', '服务态度', ],
    stars: [0, 1, 2, 3, 4],
    normalSrc: "../../images/star1.png",
    selectedSrc: "../../images/star.png",
    score: 0,
    scores: [0, 0, 0], //三种分数
    avgscore: null, //平均分
    feel: ['很差', '比较差', '一般', '比较满意', '非常满意'],
    timearry: [],
    pingjiahiddden: false,
    submitable: true,
    goodpingjia: '',
   
  },
  imageLoad: function(e) {
    var imageSize = Size.Size(e);
    var that = this;
    that.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  bindGetUserInfo: function(e) {
    var that = this
    if (e.detail.userInfo) {
      this.getOpenid()
    }
  },
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openid)
        var openid = res.result.openid;
        wx.setStorageSync('openid', openid)
        that.setData({
          openId: openid
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date1 = Date.now();
    var that = this;
    db.collection('db_window').where({
      _id: that.data.w_id
    }).get({
      success: res => {
        console.log(res)
      }
    })
    var id = options.id
    if (options.id) {
      this.setData({
        w_id: id
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      },
      fail: function() {
        Utils.networkfail();
      }
    })
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
    that.show()
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  switchNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  submit_evaluate: function(e) {
    var that = this;
    var scores = that.data.scores;
    var date1 = Date.now();
    console.log(that.data.w_id)
    console.log(wx.getStorageSync('openid'))
     if(wx.getStorageSync('openid')){
      db.collection('db_judge').where(_.and([{
        _openid: wx.getStorageSync("openid")
      },
      {
        p_time: _.gt(date1 - 3 * 1000 * 60 * 60) //近三小时内只能评论给三次
      }
      ])).count({
        success: res => {
          console.log('这个人近三小时的评价条数', res.total)
          if (res.total < 3) {
            // console.log(res.total < 3)
            db.collection('db_judge').where(_.and([{
              _openid: wx.getStorageSync("openid")
            },
            {
              w_id: that.data.w_id
            },
            {
              p_time: _.gt(date1 - 3 * 1000 * 60 * 60) //
            }
            ])).count({
              success: res => {
                console.log('此用户近三小时此窗口评价', res.total)
                if (res.total == 0) { //近三小时同一商家只能评论一次
                  // console.log(res.total)
                  wx.showLoading({
                    title: '正在提交...',
                  })
                  db.collection('db_judge').add({
                    data: {
                      w_id: that.data.w_id,
                      p_time: Date.now(),
                      score: scores,
                      avgscore: that.data.avgscore,
                      userinfo: {
                        user_name: this.data.nickName,
                        user_img: that.data.avatarUrl
                      }
                    },
                    success: res => {
                      wx.hideLoading()
                      wx.showToast({
                        title: '评价成功',
                        mask: true
                      })
                      that.setData({
                        pingjiahiddden: true
                      })
                      that.show();
                      wx.cloud.callFunction({
                        name: 'wd_rate_up',
                        data: {
                          id: that.data.w_id,
                          rate: that.data.goodpingjia
                        },
                        success: res => {
                          console.log(that.data.goodpingjia)
                          console.log(res.result)
                        },
                        fail: res => {
                          console.log(res)
                        }
                      })
                    },
                    fail: res => {
                      wx.hideLoading()
                      wx.showToast({
                        title: '网络错误',
                        icon: 'none',
                        mask: true
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '这家刚评价过不久诶',
                    icon: "none"
                  })
                }
              },
              fail: res => {
                wx.showToast({
                  title: '网络错误',
                  icon: 'none'
                })
                return
              }
            })
          } else {
            wx.showToast({
              title: '饭点时间只有三次评价机会哦',
              icon: "none"
            })
            that.setData({
              submitable: true
            })
          }
        },
        fail: res => {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            mask: false
          })
          return
        }
      })
     }
     else{
       wx.showModal({
         title: '提示',
         content: '只有授权才能评价哦',
         showCancel: true,//是否显示取消按钮
         cancelText: "关闭",//默认是“取消”
         cancelColor: 'gray',//取消文字的颜色
         confirmText: "去授权",//默认是“确定”
         confirmColor: 'orange',//确定文字的颜色
         success: function (res) {
           if (res.cancel) {
             //点击取消,默认隐藏弹框
           } else {
             //点击确定
             wx.switchTab({
               url: '../mine/mine',
             })
           }
         },
         fail: function (res) { },//接口调用失败的回调函数
         complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
       })
     
     }
   

  },
  select: function(e) {
    var that = this;
    var score = e.currentTarget.dataset.score
    that.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
        scores: that.data.scores,
        score: score,
        submitable: false
      })
    var total = 0,
      avg = 0;
    that.data.scores.forEach(res => {
      total += res - 1
    })
    avg = Math.ceil(total / 3)
    that.setData({
      avgscore: avg + 1
    })
    // console.log(that.data.feel[avg])
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  scrolltolower: function() {
    var that = this;
    this.show1;
    //  console.log(that.data.pingjiatimes)
  },
  onReady: function() {
    wx.showLoading({
      title: '窗口加载中',
    })
    var that = this;
    var wid = that.data.w_id;
    //  wid = parseInt(wid);
    var arry = wid.split('');
    var locate = '';
    var s = '';
    if (arry[0] == '1') {
      s += "杏苑"
    } else {
      s += "橘井"
    }
    switch (arry[1]) {
      case '1':
        s += '一楼';
        break;
      case '2':
        s += '二楼';
        break;
      case '3':
        s += '三楼';
        break;
      default:
        s += ''
    }
    switch (arry[2]) {
      case '1':
        s += '东';
        break;
      case '2':
        s += '南';
        break;
      case '3':
        s += '西';
        break;
      case '3':
        s += '北';
        break;
      default:
        s += ''
    }
    if (arry[3] && arry[4]) {
      s += '从右往左' + arry[3] + arry[4] + '号窗口'
    }
    that.setData({
      w_locate: s
    })
    const db = wx.cloud.database();
    db.collection('db_window').where({
      _id: wid
    }).get({
      success: res => {
        if (res.data) {
          var name = res.data[0].name,
            describe = res.data[0].describe,
            menu = res.data[0].menu,
            img = res.data[0].image;

          if (name == '') {
            name = '神秘的窗口'
          }
          if (describe == '' || describe == 'none') {
            describe = '一个有趣的店家'
          }
          this.setData({
            w_menu: menu,
            w_name: name,
            w_describe: describe,
            img: img
          })
        } else {
          wx.showToast({
            title: '商家找不到了',
          })
        }
        wx.hideLoading()
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '商家找不到了',
          icon: 'none'
        })
      }
    })
  },
  /**显示评价 */
  show: function() {
    var that = this;
    db.collection('db_judge').where({
      w_id: that.data.w_id
    }).count({
      success: res => {
        this.setData({
            pingjianum: res.total,
            pingjiatimes: Math.floor(res.total / app.globalData.max),
            currenttime: 0
          },
          function() {
            db.collection('db_judge').where({
              avgscore: _.gte(3),
              w_id: that.data.w_id
            }).count({
              success: res => {
                if (res.total != 0) {
                  var goodpingjia = (res.total / that.data.pingjianum) * 100;
                  goodpingjia = Math.ceil(goodpingjia)
                  this.setData({
                    goodpingjia: goodpingjia
                  })
                } else {
                  this.setData({
                    goodpingjia: 0
                  })
                }

              },
              fail: res => {
                wx.showToast({
                  title: '网络出错',
                  icon: 'none'
                })
                return
              }
            })
          }
        )
      },
      fail: res => {
        wx.showToast({
          title: '网络出错',
          icon: 'none'
        })
        return
      }
    })
    wx.cloud.callFunction({
      name: 'judge_get',
      data: {
        id: that.data.w_id
      },
      success: res => {
        console.log(res.result.result)
        // console.log(res.result.data)
         res.result.result.forEach(item => {
           item.p_time = Time.date_time(item.p_time)
         })
        that.setData({
          queryResult: res.result.result,
        })
      },
      fail: res => {
        console.log(res)
      }
    })

},
/**触发滚动加载 */
// show1: function() {
//     var that = this;
//     if (that.data.pingjiatimes > taht.data.currenttime) {
//       that.setData({
//         currenttime: that.data / currenttime + 1
//       })
//       wx.showLoading({
//         title: '评论加载中...',
//       })
//       db.collection('db_judge').where({
//         w_id: that.data.w_id
//       }).orderBy('p_time', 'desc').limit(app.globalData.max).skip(app.globalData.max * currenttime).get({
//         success: res => {
//           var timearry = [];
//           // console.log(res.data);
//           res.data.forEach(item => {
//             // console.log(item.p_time)
//             item.p_time = Time.date_time(item.p_time)
//           })
//           that.setData({
//             queryResult: res.data,
//           })
//           wx.hideLoading()
//         },
//         fail: res => {
//           wx.showToast({
//             title: '网络不通畅',
//             icon: 'none'
//           })
//         }
//       })
//     } else {
//       showToast({
//         title: '没有更多评价了',
//         icon: 'none'
//       })
//     }

//   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var pie = wx.createCanvasContext('my-pie')
    var that = this
    wx.cloud.callFunction({
      name: 'judge_get',
      data: {
        id: that.data.w_id
      },
      success: res => {
        var query = res.result.result
        var h = 0, s = 0, t = 0
        query.forEach(item => {
          h += item.score[0];
          s += item.score[1];
          t += item.score[2]
        })
        that.setData({
          h: h,
          s: s,
          t: t
        })
        console.log('1',h,s)
        that.showpie();
      },
      fail: res => {
        console.log(res)
      }
    })

  },
//画饼图
  showpie: function () {
    var that = this
    console.log(that.data.h, that.data.s, that.data.t)
    new Charts({
      canvasId: 'my-pie',
      type: 'pie',
      series: [{ name: '环境', data: that.data.h, color: that.data.color[0] }, { name: '服务', data: that.data.s, color: that.data.color[1] }, { name: '口味', data: that.data.t, color: that.data.color[2] }],
      width: 400,
      height:300,
      dataLabel: true,
    })
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