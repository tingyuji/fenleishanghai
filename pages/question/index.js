// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    buttonText: "下一题",
    image: 'https://www.xiaomutong.com.cn/public/products/IMG_0774.jpg',
    items: [
      {name: '1', value: ''},
      {name: '2', value: ''},
      {name: '3', value: ''},
      {name: '4', value: ''}
    ],
    users: [],
    answers: [1,1,1,1,2,2,2,2,2,2],
    imgArr:[
      "https://www.xiaomutong.com.cn/public/products/IMG_0774.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0775.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0776.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0777.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0778.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0779.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0780.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0781.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0782.jpg",
      "https://www.xiaomutong.com.cn/public/products/IMG_0783.jpg"
    ]
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let idx = this.data.idx;
    let users = this.data.users;
    users[idx]= e.detail.value;
    this.setData({
      users: users
    })

  },
  bindButtonTap: function(){
    console.log(this.data.items);
    let idx = this.data.idx;
    let imgArr = this.data.imgArr;
    console.log(idx);
    if(idx<8){
      let j = idx + 1;
      this.setData({
        idx: j,
        image: imgArr[j],
        items: [
          {name: '1', value: ''},
          {name: '2', value: ''},
          {name: '3', value: ''},
          {name: '4', value: ''}
        ]
      })
    }
    if(idx == 8){
      let j = idx + 1;
      this.setData({
        idx: j,
        buttonText: "提交",
        image: imgArr[j],
        items: [
          {name: '1', value: ''},
          {name: '2', value: ''},
          {name: '3', value: ''},
          {name: '4', value: ''}
        ]
      })
    }
    let score = 0;
    if(idx==9){
      let answers = this.data.answers;
      let users = this.data.users;
      for (let index = 0; index < 10; index++) {
        let ele1 = answers[index];
        let ele2 = users[index];
        if(ele1 == ele2){
          score += 10;
        }
      }
      wx.showModal({
        showCancel: false,
        title: '温馨提醒',
        content: '您本次答题为' + score,
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/result/index?score=' + score,
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
          } else if (res.cancel) {
  
          }
        }
      })
    }
    

  },
  bindButtonTap2: function(){
    wx.showModal({
      showCancel: false,
      title: '温馨提醒',
      content: '小编正在给您计算分数，请稍后',
      success (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})