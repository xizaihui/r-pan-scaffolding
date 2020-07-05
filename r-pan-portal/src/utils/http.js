/**
 * Created by rubin on 2020/6/4.
 */

'use strict'

import axios from 'axios'
import { clearToken, getToken } from "./cookie"
import { MessageBox, Message } from 'element-ui'
import panUtil from "./common";

const toLogin = function () {
        // to re-login
        MessageBox.confirm('您需要重新登陆', '确认退出登录', {
            confirmButtonText: '重新登陆',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            clearToken()
            location.reload()
        })
    },
    http = axios.create({
        baseURL: panUtil.getUrlPrefix(),
        timeout: 1000 * 30,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

http.interceptors.request.use(config => {
    if (config.data) {
        config.data = JSON.stringify(config.data)
    }
    let token = getToken()
    if (token) {
        config.headers['Authorization'] = token
    }
    return config
}, error => {
    Message.error('请求失败')
    return Promise.reject(error)
})

http.interceptors.response.use(res => {
    if (res.data.status === 10) {
        toLogin()
        return
    }
    return res.data
}, error => {
    Message.error('请求失败')
    return Promise.reject(error)
})

export default http
