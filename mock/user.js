const Mock = require("mockjs");
//用户列表
var userlist = [
  {
    uid: "dc8f0be43ca94ba3b03084d681285680",
    linkCreateTime: "2022-04-25 10:00:26",
    checkNum: 3, // 认证次数
    checkStatus: "0",//1认证通过，0未认证通过
  },
];

module.exports = [
  {
    url: "/user/info.*",
    type: "get",
    response: (config) => {
      const { uid } = config.query;
      let userInfo = userlist.filter((item) => {
        if(item.uid === uid)return true;
      });

      if(userInfo && userInfo.length>0){
        console.log(userInfo[0])
        return {
          code: 200,
          data: userInfo[0],
        };
      }else{
        return {
          code: -1,
          message: "",
        };
      }
    },
  },

  // 人脸识别验证
  {
    url: "/user/checkFace",
    type: "post",
    response: (config) => {
      const dataItem = config.query;
      userlist = userlist.map((l) => {
        if(l.uid === dataItem.uid){
          l.checkNum ++
          console.log(l)
          return l
        }
      });
      let userInfo = userlist.filter((item) => {
        if(item.uid === dataItem.uid)return true;
      });
      if(userInfo && userInfo.length>0){
        return {
          code: 200,
          identCode:'N',
          data: userInfo[0],
        };
      }else{
        return {
          code: -1,
          identCode:'N',
          message: "",
        };
      }
    },
  },
];
