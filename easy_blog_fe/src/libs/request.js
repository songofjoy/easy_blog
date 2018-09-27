import axios from 'axios';
import { Message } from 'iview';
import { Modal } from 'iview';

function checkStatus (res) {
    if (res.status === 200 || res.status === 304) {
        return res;
    }

    const errorMsg = res.statusText || '请求或操作失败，请重试！';
    const error = new Error(errorMsg);
    error.res = res;

    throw error;
}

function checkAuth (res) {
    if (res && res.code !== 403) {
        return res;
    }
    const error = new Error('没有权限');
    error.code = 403;
    error.permissionApplyUrl = res.url;
    throw error;
}

function request (config) {
    config.withCredentials = true;
    return axios(config)
        .then(checkStatus)
        .then(res => res.data)
        .then(checkAuth)
        .catch(error => {
            if (error.code === 403) {
                Modal.error({
                    title: '没有权限',
                    content: `<a href="${error.permissionApplyUrl}" target="_blank" style="font-size: 16px;">点这里申请权限</a>`,
                });
            } else {
                Message.error(error.message);
            }
        });
}

export default request;
