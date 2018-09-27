let Const = {

};

Const.INPUT_TYPE = {
    text: 1,
    json: 2,
    yaml: 3,
    history: 4,
};

Const.ETCD_KEY = {
    prefix: '/content/review_',
};

Const.OPERATION_TYPE = {
    select: 2,
    enum_type: 4,
    custom: 8,
    custom_json: 16,
    select_req: 3,
    enum_req: 5,
    custom_req: 9,
};

Const.Batch_Product = {
    aweme_user_info: [
        {label: '送审', value: 'send_task', disabled: false },
        {label: '头像重置', value: 'reset_user_avatar', disabled: true },
        {label: '封禁', value: 'ban_user', disabled: true },
    ],

    toutiao_video: [
        {label: '送审', value: 'send_task', disabled: false },
        {label: '下架', value: 'auto_process', disabled: true },
        {label: '详情可见', value: 'detail_visible', disabled: false },
    ],
    toutiao_article: [
        {label: '送审', value: 'send_task', disabled: false },
        {label: '下架', value: 'auto_process', disabled: true },
        {label: '详情可见', value: 'detail_visible', disabled: true },
    ],
    default: [
        {label: '送审', value: 'send_task', disabled: false },
        {label: '下架', value: 'auto_process', disabled: true },
    ],
};

Const.Filter_ConfigKey = {
    toutiao_video: [
        {label: '标题', value: 'title', disabled: false },
        {label: '正文', value: 'content', disabled: false },
        {label: '展示状态', value: 'display_status', disabled: false },
        {label: '账号类型', value: 'media_account', disabled: false },
    ],
    toutiao_article: [
        {label: '标题', value: 'title', disabled: false },
        {label: '正文', value: 'content', disabled: false },
        {label: '展示状态', value: 'display_status', disabled: false },
        {label: '账号类型', value: 'media_account', disabled: false },
    ],
    default: [
        {label: '标题', value: 'title', disabled: false },
        {label: '正文', value: 'content', disabled: false },
    ],
};

Const.Handle_Product = {
    configs: [
        {
            label: 'default',
            value: 'default',
            majors: [
                {label: '送审', value: 'send_task'},
                {label: '下架', value: 'auto_process'},
            ],
        },
        {
            label: '抖音用户资料',
            value: 'aweme_user_info',
            majors: [
                {label: '送审', value: 'send_task'},
                {label: '头像重置', value: 'reset_user_avatar'},
                {label: '封禁', value: 'ban_user'},
            ],
        },
    ],
};


Const.User_Product = {
    products: [
        {
            label: '头条',
            value: 'toutiao',
            majors: [
                {label: '规范信源', value: 'guifanxinyuan', disabled: true },
                {label: '新闻媒体', value: 'xinwenmeiti', disabled: false },
                {label: '自媒体', value: 'zimeiti', disabled: false },
                {label: '原创', value: 'yuanchuang', disabled: true },
            ],
        },
        {
            label: '火山',
            value: 'hotsoon',
            majors: [
                {label: '普通用户', value: 'putongyonghu', disabled: false },
                {label: '达人', value: 'daren', disabled: true },
                {label: '主播', value: 'zhubo', disabled: true },
            ],
        },
    ],
};


Const.Video_Product = {
    products: [
        {
            label: '抖音',
            value: 'aweme',
            majors: [
                {label: '通过', value: 'tongguo', disabled: true },
                {label: '自见', value: 'zijian', disabled: false },
                {label: '不通过', value: 'butongguo', disabled: false },
                {label: '热门', value: 'remen', disabled: true },
                {label: '新鲜', value: 'xinxian', disabled: true },
                {label: '不推荐', value: 'butuijian', disabled: false },
            ],
        },
        {
            label: '火山',
            value: 'hotsoon',
            majors: [
                {label: '通过', value: 'tongguo', disabled: true },
                {label: '自见', value: 'zijian', disabled: false },
                {label: '不通过', value: 'butongguo', disabled: false },
                {label: '推荐', value: 'tuijian', disabled: true },
                {label: '降权', value: 'jiangquan', disabled: false },
                {label: '不推荐', value: 'butuijian', disabled: false },
                {label: '风险', value: 'fengxian', disabled: false },
                {label: '非风险', value: 'feifengxian', disabled: true },
            ],
        },
    ],
};

export default Const;
