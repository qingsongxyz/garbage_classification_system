/**
 * 今天的月份
 * @returns 今天的月份
 */
export function getTodayMonth() {
    let date = new Date();
    return (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
}

/**
 * 今天的日期
 * @returns 今天的日期
 */
export function getTodayDay() {
    let date = new Date();
    return date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
}

/**
 * 今天日期格式化(yyyy-MM-dd)字符串
 * @returns 今天日期格式化(yyyy-MM-dd)字符串
 */
export function getTodatDateStr() {
    let date = new Date();
    //获取年份  
    let Y = date.getFullYear();
    //获取月份  
    let M = getTodayMonth();
    //获取当日日期 
    let D = getTodayDay()
    return Y + '-' + M + '-' + D;
}

export function getNowDate() {
    return new Date(+new Date() + 8 * 3600 * 1000).toJSON().substring(0, 19);
}