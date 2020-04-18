//size.js
function Size(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片的原始高
  //图片宽高比
  var originalScale = originalHeight / originalWidth;
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;//获取屏幕宽高
      var windowHeight = res.windowHeight;//获取屏幕宽高
      imageSize.imageWidth=windowWidth;
      imageSize.imageHeight=imageSize.imageWidth*originalScale;
    },
  })
  return imageSize;
}
module.exports = {
  Size: Size
}

