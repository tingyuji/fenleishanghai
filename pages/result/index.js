const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    userInfo: {},
    windowWidth: '',
    posterHeight: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log('2019062102');
    console.log(app.globalData);  
      
    const poster = {
      "with": 511,
      "height": 800
    }
    const systemInfo = wx.getSystemInfoSync();
    console.log(systemInfo);
    let windowWidth = systemInfo.windowWidth-20
    let windowHeight = systemInfo.windowHeight
    let posterHeight = parseInt((windowWidth / poster.with) * poster.height)
    this.setData({
      userInfo: app.globalData.userInfo,
      windowWidth: windowWidth,
      posterHeight: posterHeight,
      score: options.score
    })
  },
  viewAnswer: function(){
    wx.navigateTo({
      url: '/pages/answer/index',
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  promiseBdImg: function(){
    const _this = this
    const bdImagePath = '../../static/images/common/'
    return new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: bdImagePath + "base.png",
        success: function (res) {
          console.log('promiseBdImg', res)
          resolve(res);
        },
        fail: function(err){
          console.log('2019062007');
          console.log(err);
        }
      })  
    });
  },
  onReady: function () {
    const _this = this

    //默认进入页面就生成背景图
    var windowWidth = this.data.windowWidth;
    var posterHeight = this.data.posterHeight;
    this.promiseBdImg().then(res => {
      console.log('Promise.all', res)
      const ctx = wx.createCanvasContext('shareImg')
      ctx.width = windowWidth
      ctx.height = posterHeight
      console.log(windowWidth, posterHeight)
      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res.path, 0, 0, windowWidth, posterHeight, 0, 0)
      ctx.save() // 对当前区域保存
      ctx.draw()

    }).then( () => {
    
    })    
  },
  downLoadFile: function(file){
    console.log('2019062002');
    console.log(file);
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: file,
        success: function (res) {
          console.log('20190620')
          console.log(res) 
          resolve(res)
        }
      })
    }).catch(res=>{
      console.log('catch',res)
    });
  },
  getAvatarImg: function () {
    let userInfo = app.globalData.userInfo;
    let avatarUrl = userInfo.avatarUrl;
    this.downLoadFile(avatarUrl).then((res) => {
      console.log('2019062003')
      console.log(res)
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success: function (res) {
          console.log('2019062004')
          wx.setStorageSync('avatarUrl', res.savedFilePath)
        },
        fail: function(err){
          console.log('2019062005')
          console.log(err);
        }
      })
    })
  },
  generateImage: function(e){
    app.globalData.userInfo = e.detail.userInfo
    let userInfo = e.detail.userInfo
    console.log('userInfo', userInfo)
    // 更新用户信息
    // api.post('更新用户信息的url', userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    });

    console.log('2019062006');
    // 头像
    // let promiseAvatarUrl = new Promise(function (resolve, reject) {
    //   resolve(wx.getStorageSync('avatarUrl'))
    // }).catch(res=>{
    //   console.log('catch',res)
    // });

    wx.showLoading({
      title: '正在生成海报，请稍后'
    })

    let avatarUrl = userInfo.avatarUrl;
    let nickName = userInfo.nickName;
    let promiseAvatarUrl = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: avatarUrl,
        success: function (res) {
          console.log('promiseAvatarImg', res)
          resolve(res);
        },
        fail: function(err){
          console.log('2019070501');
          console.log(err);
        }
      })  
    });

    const _this = this

    const qrImagePath = '../../qrcode/'
    let promiseQrcodeImg = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: qrImagePath + "gh_d2778c07ec2e_258.jpg",
        success: function (res) {
          console.log('promiseQrcodeImg', res)
          resolve(res);
        },
        fail: function(err){
          console.log('2019062007');
          console.log(err);
        }
      })  
    });    

    var windowWidth = this.data.windowWidth;
    var posterHeight = this.data.posterHeight;
    Promise.all([
      promiseAvatarUrl, promiseQrcodeImg
    ]).then(res => {
      console.log('Promise.all', res)
      const ctx = wx.createCanvasContext('shareImg')
      ctx.width = windowWidth
      ctx.height = posterHeight
      console.log(windowWidth, posterHeight)
      //主要就是计算好各个图文的位置
      
      ctx.drawImage(res[0].path,148, 10, 75, 75, 0, 0) // 把图片填充进裁剪的圆形
      ctx.restore() // 恢复
      ctx.save()
      
      ctx.beginPath() // 开始新的区域
      ctx.drawImage('../../' + res[1].path, 128, 266, 94, 94, 0, 0) // 把图片填充进裁剪的圆形
      ctx.restore() // 恢复
      ctx.save()

      ctx.beginPath();
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.setFontSize(22)      
      ctx.fillText('得分'+_this.data.score, 180, 250)
      ctx.setFontSize(18) 
      ctx.fillText('欢迎'+ nickName +'参加垃圾分类答题活动', 180, 414)
      ctx.stroke()
      ctx.draw(true)

    }).then( () => {
      wx.hideLoading()
    })
  },
  saveImage: function(){
    var windowWidth = this.data.windowWidth;
    var posterHeight = this.data.posterHeight;

    var _this = this
    wx.showLoading({
      title: '正在保存海报，请稍后'
    })
    new Promise(function (resolve, reject) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: windowWidth*2,
        height: posterHeight*2,
        destWidth: windowWidth*2,
        destHeight: posterHeight*2,
        canvasId: 'shareImg',
        success: function (res) {
          console.log(res.tempFilePath);
          _this.setData({
            prurl: res.tempFilePath,
            hidden: false
          })
          resolve(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }).then(res => {
      console.log(res)
      this.save(res)
    })
  },
  save: function(data){
    wx.getSetting({
      success: res => {
        console.log(res);     
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.saveImageToPhotosAlbum({
            filePath: data.tempFilePath,
            success(result) {
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '海报已保存到本地',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              console.log(result)
            }
          })
        }else if(!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(result) {
              wx.saveImageToPhotosAlbum({
                filePath: data.tempFilePath,
                success(result) {
                  wx.hideLoading()
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '海报已保存到本地',
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                  console.log(result)
                },
                fail: function(err){
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: JSON.stringify(err),
                    success (res) {
                     
                    }
                  })
                }
              })
            },
            fail: function(err){
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: JSON.stringify(err),
                success (res) {
                 
                }
              })
            }
          })
        }
      }
    })
  }
})