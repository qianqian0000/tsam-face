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
    url: "/dcenter/facerecog/findConfig",
    type: "post",
    response: (config) => {
      console.log(config.query)
      return {
        "mslResultCode" :"0000",
        "body": {
          "configValue": "0.4"
      }
      }

    },
  },
  {
    url: "/dcenter/facerecog/linkInfo",
    type: "post",
    response: (config) => {
      const { linkUid } = config.query
      console.log(linkUid)
      return {
        "mslResultCode" :"0000",
        "body":{
          "name": '*三三'
        }
      }
      /*
      let userInfo = userlist.filter((item) => {
        if(item.uid === linkUid)return true;
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
      */
    },
  },

  // 人脸识别验证
  {
    url: "/dcenter/facerecog/frontFaceRecog",
    type: "post",
    response: (config) => {
      const dataItem = config.query;
      return {
        "mslResultCode" :"0004",
      }
      /*
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
      */
    },
  },
];
