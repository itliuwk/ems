import fetch from '@/utils/fetch.js'

const ems = 'esems/'
// TODO:储能概览
/**
 * 储能ems概况svg图接口
 * @param {*} data
 */
export function getSvgDataByCustomerId(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/getSvgDataByCustomerId',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 空调运行状态查询
 * @param {*} data
 */
export function getMicrofractureStatus(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/microfracture/status',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 判断是否配置了下行控制密码
 * @param {*} data
 */
export function getJrcpe(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/jrcpe',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 设置下行控制密码
 * @param {*} data
 */
export function postSrcp(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/srcp',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 验证下行控制密码
 * @param {*} data
 */
export function postVerifyPassword(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/verifyPassword',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}



/**
 * 修改下行控制密码
 * @param {*} data
 */
export function postMrcp(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/mrcp',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}



/**
 * 执行下行控制
 * @param {*} data
 */
export function postExecute(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/execute',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}



/**
 * 检查并更新数据统计的数据
 * @param {*} data
 */
export function checkStatisticsData(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + '/overview/checkStatisticsData',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}




/**
 * 数据统计
 * @param {*} data
 */
export function getStatisticsData(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/getStatisticsData',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}



/**
 * 获得数据统计的明细
 * @param {*} data
 */
export function getBmsStaDetailed(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/getBmsStaDetailed',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 系统动态
 * @param {*} data
 */
export function getSystemDynamicsData(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/getSystemDynamicsData',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 获得相关客户的PCS概览数据
 * @param {*} data
 */
export function getDataByCustomerId(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'center/getDataByCustomerId',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}




// TODO:PSC监测
/**
 * 获得PCS实时功率曲线数据
 * @param {*} data
 */
export function getPcsActiveDataByCustomer(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'pcs/getPcsActiveDataByCustomerId',
            method: 'post',
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 获得PCS状态数据
 * @param {*} data
 */
export function getPcsStateData(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'pcs/getPcsStateData',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}




// TODO:BMS监测
/**
 * 获得当前用户的BMS电池组设备列表
 * @param {*} data
 */
export function getEquipmentListByType(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'bms/getEquipmentListByType',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}


/**
 * 获得BMS电池实时功率曲线数据
 * @param {*} data
 */
export function getBmsActiveDataByCustomerId(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'bms/getBmsActiveDataByCustomerId',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}

/**
 * 获得Bbms电池组数据
 * @param {*} data
 */
export function getBmsCellgroupData(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'bms/getBmsCellgroupData',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}





/**
 * 获得二次设备列表
 * @param {*} data
 */
export function getSecondaryEquipmentList(data) {
    return new Promise((resolve, reject) => {
        fetch({
            url: ems + 'overview/getSecondaryEquipmentList',
            method: 'post',
            responseType: "json",
            data,
        }, function (res) {
            resolve(res);
        }, function (err) {
            reject(err);
        })
    })
}