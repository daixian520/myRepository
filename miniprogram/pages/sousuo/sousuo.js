const Util = require('../../utils/util.js')
const db=wx.cloud.database();
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 15, //一次加载条数
    queryResult: [], //查询的值
    currenttime: 0, //当前第几次加载
    multiArray: [
      ['全部', '杏苑', '橘井'],
      ['全部', '一楼', '二楼', '三楼'] //给picker赋初始值
    ],
    multiIndex: [0, 0],
    sousuoValue: null,
    buttonvalue: '取消'
  },
  /**picker列改变级联事件 */
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
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
    console.log(data.multiIndex)
    this.setData(data)
  },
  /**picker值改变事件 */
  bindMultiPickerChange(e) {
    var that = this;
    that.setData({
      multiIndex: e.detail.value,
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var cloumn1 = e.detail.value[0], //取picker第一列的值
      cloumn2 = e.detail.value[1]//取picker第二列的值
    if (e.detail.value[0] == 0) {
      cloumn1 = '.'
    }
    if (e.detail.value[1] == 0) {
      cloumn2 = ''
    }
    // console.log(a + b)
    that.setData({ //为query提供搜索条件
      cloumn1: cloumn1,
      cloumn2: cloumn2
    })
    this.query1();
  },
  query1: function () {
    var that = this;
    var max = that.data.max
    console.log(that.data)
    wx.showLoading({
      title: '加载中',
    })
    //以下分支代表1没有标签选择和搜索框选择，2进行标签关联，3进行搜索框关联查询分别进行计算总条数和skip查询
    if (!that.data.sousuoValue) {
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).count({
        success: res => {
          console.log('s', res.total)
          that.setData({
            w_count: res.total,
            /**计算总共需要几次 */
            w_times: Math.floor(res.total / max)
          })
          console.log(Math.floor(res.total / max))
        },
        fail: res => {
          Util.networkfail();
        }
      })
    }
    else {
      db.collection('db_window').where(_.and([{
        'menu.footname': {
          $regex: that.data.sousuoreg
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
            w_times: Math.floor(res.total / max)
          })
          console.log(Math.floor(res.total / max))
        },
        fail: res => {
          Util.networkfail()
        }
      })
    }
    if (!that.data.sousuoValue) {
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
    /**如果搜索框的值不为空，则为搜索框的关联过滤 */
    else {
      console.log('----else----')
      console.log('a', that.data.cloumn1, 'b', that.data.cloumn2, that.data.sousuoValue)
      db.collection('db_window').where(_.and([{
        'menu.footname': {
          $regex: that.data.sousuoreg
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
  query2:function () {
    var that = this;
    var max = that.data.max
    wx.showLoading({
      title: '加载中',
    })
  /*搜索框无值* */
    if (!that.data.sousuoValue) {
      db.collection('db_window').where({
        _id: {
          $regex: '^' + that.data.cloumn1 + that.data.cloumn2
        }
      }).count({
        success: res => {
          console.log('if', res.total)
          that.setData({
            w_count: res.total,
            /**计算总共需要几次 */
            w_times: Math.floor(res.total / max)
          })
          console.log(Math.floor(res.total / max))
        },
        fail: res => {
          Util.networkfail();
        }
      })
    }
    else {
      db.collection('db_window').where(_.and([{
        'menu.footname': {
          $regex: that.data.sousuoreg
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
            w_times: Math.floor(res.total / max)
          })
          console.log(Math.floor(res.total / max))
        },
        fail: res => {
          Util.networkfail()
        }
      })
    }
    if (!that.data.sousuoValue) {
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
    /**如果搜索框的值不为空，则为搜索框的关联过滤 */
    else {
      console.log('----else----')
      console.log('a', that.data.cloumn1, 'b', that.data.cloumn2, that.data.sousuoValue)
      db.collection('db_window').where(_.and([{
        'menu.footname': {
          $regex: that.data.sousuoreg
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
          Util.networkfail();
        }
      })
    }
  },
  searchbtn: function (e) {
    var that = this;
    if (e.currentTarget.dataset.btnv == '取消') {
      wx.navigateBack()
    }
    else {
      that.sousuo()
    }
  },
  /**清空搜索框事件 */
  clearInput: function () {
    this.setData({
      sousuoValue: "",
      buttonvalue: '取消'
    });
  },
  /**输入搜索框事件 */
  inputTyping: function (e) {
    var that = this;
    if (e.detail.value.length > 0) {
      console.log(e.detail.length)
      var souarray=e.detail.value.split('')
      var str=''
      souarray.forEach(item=>{
       str+=item+'+.*'
      })
      console.log(str)
      that.setData({
        buttonvalue: '搜索',
        sousuoValue: e.detail.value,
        sousuoreg:str
      })
      
    } else {
      that.clearInput();
    }
    console.log('input', e.detail.value)
  },
  sousuo: function () {
    var that = this;
    //  if(!eatvalue) {
    var max = that.data.max
    db.collection('db_window').where({
      'menu.footname': {
        $regex: that.data.sousuoreg
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
    db.collection('db_window').where({
      'menu.footname': {
        $regex: that.data.sousuoreg
      }
    }).limit(that.data.max).skip(0).get({
      success: res => {
        console.log(res.data);
        this.setData({
          queryResult: res.data,
          // sousuoValue: null,
          multiIndex: [0, 0],
          currenttime: 0,
          tishi: that.data.sousuoValue
        })
      },
      fail: res => {
     
        Util.networkfail();
      }
    })
    // }
  },
  gowindow: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../window-info/window-info?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    var currenttime1 = that.data.currenttime;
    console.log('----bottom----', currenttime1)
    // if (that.data.w_times > 0) {
    console.log(that.data.w_times)
    if (currenttime1 >= that.data.w_times) {
      console.log('到底bottom times', that.data.w_times)
      console.log(currenttime1 > that.data.w_times)
      wx.showToast({
        title: '我是有底线de',
      })
    } else {
      var mutiindex = that.data.multiIndex;
      var cloumn1 = mutiindex[0], //取picker第一列的值
        cloumn2 = mutiindex[1] //取picker第二列的值
      if (mutiindex[0] == 0) {
        cloumn1 = '.'
      }
      if (mutiindex[1] == 0) {
        cloumn2 = ''
      }
      // console.log(a + b)
      that.setData({ //为query提供搜索条件
        cloumn1: cloumn1,
        cloumn2: cloumn2,
        currenttime: currenttime1 + 1
      })
      that.query2();
      console.log('这是第几次上滑', that.data.currenttime)
      console.log('共几次', that.data.w_times)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
