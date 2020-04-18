var z_num = 0;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    animationData: {},
    zhuanpanImg: "",
    selectFood: '',
    cahidden: false,
    gofood: '米饭',
    temfood: [],
    hbtngo: false,
  },
/**初始化转盘 */
  initzhuanpan: function () {
    var that = this;
    that.setData({
      startImg: "../../images/dianji.png",
      food: ["米饭", "麻辣烫冒菜", "包子粥",
        "香锅干锅", "炒饭", "韩式料理", "米粉面", "夹馍饼"
      ],
      animationData: {},
      canrotate: true,
      cahidden: false,
      initzbbtn: true,
       hbtngo: false,
      deg: 0,
      size: 8,
      singleAngle: 45,
      endAddAngle: 0 //每次旋转后画布的角度
    })

    this.zhuan();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /**画转盘 */
  zhuan() {
    var that = this;
    that.setData({
      zhuanpanImg:''
    })
    var w = that.data.w,
      h = that.data.h,
      r = w / 2.5,
      // img = that.data.zhuanpanImg,
      startimg = that.data.startImg,
      food = that.data.food,
      size = food.length,
      angle = 360 / size;
    const ctx = wx.createCanvasContext('mypie');
    // const ctxstart = wx.createCanvasContext('mypiestart');
    //画圆盘
    ctx.translate(w / 2, h / 2);
    for (var i = 0; i < size; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, w / 2.5, 0, angle * Math.PI / 180);
      ctx.lineTo(0, 0);
      ctx.setStrokeStyle('gray');
      //颜色分单双
      if (i % 2 == 0) {
        ctx.setFillStyle('#fde6d2')
      } else {
        ctx.setFillStyle('white')
      }
      ctx.fill();
      ctx.closePath();
      //写食物选项
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.setFontSize(14); //设置文字字号大小
      ctx.setFillStyle("#000"); //设置文字颜色
      ctx.setTextAlign("center"); //使文字垂直居中显示
      ctx.setTextBaseline("middle"); //使文字水平居中显示
      //判断字体的宽度如果过宽缩放字体
      var textY = -w / 4;
      //字体所在扇形位置弧长
      var textW = angle * Math.PI / 180 * (-textY);
      //获取食物长度
      var textL = food[i].length;
      //如果字体宽度大于弧长，字体字号变小
      if (ctx.measureText(food[i]).width > textW) {
        ctx.setFontSize(textW / textL);
      }
      //对写入的文字进行旋转，因为旋转之前是在圆心的正上方，而扇形是在0度开始画的也就是第四象限，所
      ctx.rotate((angle / 2 + 90) * Math.PI / 180);
      ctx.fillText(food[i], 0, -w / 4);
      //恢复状态，继续循环
      ctx.restore();
      ctx.rotate(angle * Math.PI / 180);
      ctx.stroke();
    }
    // ctx.draw();
    ctx.draw(false, setTimeout(
      function(){
        //导出图片
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: that.data.w,
          height: that.data.w,
          destWidth: that.data.w * 2.5,
          destheight: that.data.w * 2.5,
          canvasId: 'mypie',
          success(res) {
            that.setData({
              zhuanpanImg: res.tempFilePath,
              cahidden: true
            })
          },
          fail(res) {
            wx.showModal({
              title: res,
              content: 'none',
            })
            that.onLoad()
          },
          complete(res) {
          }
        })
      },300));
    // ctxstart.translate(w / 2, h / 2);
    // ctxstart.drawImage(startimg, -30, -25, 120, 50);
    // ctxstart.draw();

    //画圆盘结束
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      startImg: "../../images/dianji.png",
      food: ["米饭", "麻辣烫冒菜", "包子粥",
        "香锅干锅", "炒饭", "韩式料理", "米粉面", "夹馍饼"
      ],
      animationData: {},
      canrotate: true,
      cahidden: false,
      initzbbtn:true,
      hbtngo: false,
      deg: 0,
      size: 8,
      singleAngle: 45,
      endAddAngle: 0 //每次旋转后画布的角度
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          w: res.windowWidth,
          h: res.windowWidth
        })
      },
    });
    //创建动画实例
    const animation = wx.createAnimation({
      duration: 6000,
      timingFunction: 'ease',
      transformOrigin: '50% 50% 0'
    })
    that.animation = animation;
    that.zhuan();
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      z_num: 0
    })
  },
  hideModal_Y: function() {
    var that = this;
    that.setData({
      cahidden: false,
      initzbbtn: false,
      // hbtngo: false,
      food: that.data.temfood,
      size: that.data.z_num,
      singleAngle: 360 / that.data.z_num,
      hbtngo: true
    })
    wx.showToast({
      title: '转盘正在初始化...',
      icon: 'none',
      mask: true,
      duration: 6000
    })
    this.animation.rotate(that.data.rotateangle + that.data.endAddAngle).step();
    that.setData({
      animationData: this.animation.export()
    })
    that.hideModal()
    that.zhuan();
  },
  hideModal_N: function() {
    this.hideModal();
  },
  inputnumber: function(e) {
    var that = this;
    var z_num = parseInt(e.detail.value);
    if (z_num > 10) {
      z_num = 10
    } else if (z_num < 2) {
      z_num = 2
    }
    that.setData({
      z_num: z_num
    })
  },
  foodchange: function(e) {
    var that = this;
    var temfood = 'temfood[' + e.currentTarget.dataset.id + ']'
    var value = e.detail.value
    that.setData({
      [temfood]: value
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
  // onHide: function() {
  //   this.huifu()
  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  huifu: function() {
    var that = this;
    var animation = that.animation;
    animation.rotate(0).step();
    that.setData({
      animationData: that.animation.export()
    })
  },
  onUnload: function() {
    this.huifu()
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

  },


  /**点击start圆盘开始转 */
  start: function() {
    var that = this;
    var startdeg = that.data.deg;
    // this.animation = that.animation;
    if (that.data.canrotate) {
      that.setData({
        canrotate: false //如果正在旋转，点击无效
      })
      // console.log(that.data.canrotate)
      /**保证在扇形中间 */
      let tempangle = that.data.singleAngle / 2;
      const endAddAngle = Math.floor((Math.random() * (that.data.size))) * that.data.singleAngle + tempangle // 一圈内中奖角度
      const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360; // 随机旋转几圈再停止
      var rotateangle = -(startdeg + endAddAngle + rangeAngle)
      that.animation.rotate(-(startdeg + endAddAngle + rangeAngle)).step();
      that.setData({
        animationData: this.animation.export(),
        rotateangle: rotateangle,
        endAddAngle: endAddAngle
      })
      startdeg += rangeAngle; //保证角度一直在增大
      that.setData({
        deg: startdeg
      })
      /**旋转的扇形的个数*/
      var selectfood = Math.floor(endAddAngle / this.data.singleAngle);
      that.setData({
        selectFood: selectfood,
      })
    }
    /*当动画完成时触发事件，按钮文字改变，并且恢复点击能力*/
    setTimeout(function() {
      wx.showToast({
        title: that.data.food[that.data.selectFood],
        icon: 'none'
      })
      that.setData({
        canrotate: true,
        gofood: that.data.food[that.data.selectFood]
      })
    }, 6000)
  },
 
  /**点击button去往所抽中的类别信息，并设置全局变量以实现传参*/
  goeat: function() {
    var that = this;
    var label = that.data.gofood;
    console.log(label)
    app.globalData.label = label;
    wx.switchTab({
      url: '../chisha/chisha'
    })
  },
})
