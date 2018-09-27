import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下

// export const page404 = {
//     path: '/*',
//     name: 'error-404',
//     meta: {
//         title: '404-页面不存在',
//     },
//     component: resolve => { require(['@/views/error-page/404.vue'], resolve); },
// };
//
// export const page403 = {
//     path: '/403',
//     meta: {
//         title: '403-权限不足',
//     },
//     name: 'error-403',
//     component: resolve => { require(['@//views/error-page/403.vue'], resolve); },
// };
//
// export const page500 = {
//     path: '/500',
//     meta: {
//         title: '500-服务端错误',
//     },
//     name: 'error-500',
//     component: resolve => { require(['@/views/error-page/500.vue'], resolve); },
// };

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '',
        icon: 'md-albums',
        name: 'config-key',
        title: '业务线配置',
        component: Main,
        children: [
            {
                path: '',
                name: 'config-key',
                title: '业务线配置',
                component: resolve => { require(['@/views/page/HelloWorld.vue'], resolve); },
            },
        ],
    },
    {
        path: '/project',
        icon: 'ios-add-circle',
        name: 'project',
        title: '审核队列配置',
        component: Main,
        children: [
            {
                path: '',
                name: 'project2',
                title: '审核队列配置',
                component: resolve => { require(['@/views/page/Etcd.vue'], resolve); },
            },
        ],
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    ...appRouter,
    // page500,
    // page403,
    // page404,
];
