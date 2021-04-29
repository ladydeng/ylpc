/* 手机号校验 */
export function validateMobile(str) {
    const reg = /^1[3|6|4|5|7|8][0-9]{9}$/
    return reg.test(str)
}

/* 身份证校验 */
export function validateIdCard(str) {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(str)
}
/* 银行卡校验 */
export function validatebankCard(str) {
    const reg = /^[1-9]\d{9,29}$/
    return reg.test(str)
}
/* 日期校验 */
export function validateDate(str) {
    const reg = /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/
    return reg.test(str)
}

