//utils.js

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片的原始高
  var originalScale = originalHeight/originalWidth;/**图片宽高比*/
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;//获取屏幕宽高
      var windowHeight = res.windowHeight;//获取屏幕宽高
      if(windowWidth>=768){
        imageSize.imageWidth = 0.4 * windowWidth;
        imageSize.imageHeight = imageSize.imageWidth * originalScale; //图片的高度等于图片的高乘以宽高比   为了保证图片不变形
      } else if (windowWidth >= 1024){
        imageSize.imageWidth = 0.1* windowWidth;
        imageSize.imageHeight = imageSize.imageWidth * originalScale; //图片的高度等于图片的高乘以宽高比   为了保证图片不变形
      }
      else{
        imageSize.imageHeight = 0.6 * windowHeight;
        imageSize.imageWidth = imageSize.imageHeight / originalScale;
        
      }
    },
  })
  return imageSize;
}
function networkfail(){
  wx.hideLoading();
wx.showToast({
  title: '网络错误',
  icon:'none',
})
return
}
module.exports={
  imageUtil:imageUtil,
  networkfail:networkfail,
}
