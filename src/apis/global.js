/**
 * @date 2019/9/1
 * @auth yy
 * @desc 首页所有api方法入口
*/
import fetch from '@/utils/fetch.js'

/**
 * @desc 自动登录
*/
export function authLogin(fn, errFn) {
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/userManage/getUserInfoAndMenu',
      method: 'get',
      responseType: "json",
      params: {
        belongTo: "ESEMS"
      }
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}

/**
 * @desc 获取系统环境配置
 */
export function getEnvConfig(fn, errFn) {
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/deploy/config',
      method: 'get',
      responseType: "json"
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}


/**
 * @desc 验证是否以customerId登录
 */
export function loginJumpCustomerId(fn, errFn) {
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/login/jumpCustomerId',
      method: 'get',
      responseType: "json"
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}



/**
 * @desc 以customerId获取用户信息
 */
export function getUserInfoByCustomer(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/userManage/getUserInfoByCustomer',
      method: 'get',
      responseType: "json",
      params: data
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}


/**
 * @desc 获取中心下的所有客户
 */
export function queryCustomerList(data) {
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/userManage/queryCustomerList',
      method: 'post',
      responseType: "json",
      params: data
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}


/**
 * @desc 根据id获得logo图片id
 */
export function getLogoById(data) {
  console.log(data);
  return new Promise((resolve, reject) => {
    fetch({
      url: 'esems/userManage/getCustomerLogoById',
      method: 'post',
      responseType: "json",
      data: data
    }, function (res) {
      resolve(res);
    }, function (err) {
      reject(err);
    })
  })
}

