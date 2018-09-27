export default {
    name: 'comm',
    data () {
        return {
            time_select_options: {
                shortcuts: [
                    {
                        text: '前一小时',
                        value () {
                            const end = new Date();
                            const start = new Date();

                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000) - 3600 * 1000);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000));
                            return [start, end];
                        },
                    },
                    {
                        text: '本小时',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000));
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000) + 3600 * 1000);
                            return [start, end];
                        },
                    },
                    {
                        text: '昨天',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24) - 3600 * 1000 * 24 - 3600 * 1000 * 8);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24) - 3600 * 1000 * 8);
                            return [start, end];
                        },
                    },
                    {
                        text: '今天',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24) - 3600 * 1000 * 8);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24) + 3600 * 1000 * 24 - 3600 * 1000 * 8);
                            return [start, end];
                        },
                    },
                    {
                        text: '最近三天',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24 * 3) - 3600 * 1000 * 24 * 3 + 3600 * 1000 * 16);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24 * 3) + 3600 * 1000 * 16);
                            return [start, end];
                        },
                    },
                    {
                        text: '最近一周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24 * 7) - 3600 * 1000 * 24 * 7 + 3600 * 1000 * 16);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24 * 7) + 3600 * 1000 * 16);
                            return [start, end];
                        },
                    },
                    // {
                    //     text: '本周',
                    //     value () {
                    //         const end = new Date();
                    //         const start = new Date();
                    //         start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24 * 7) + 3600 * 1000 * 16);
                    //         end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24 * 7) + 3600 * 1000 * 24 * 7 + 3600 * 1000 * 16);
                    //         return [start, end];
                    //     },
                    // },
                    {
                        text: '最近一个月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - start.getTime() % (3600 * 1000 * 24 * 30) - 3600 * 1000 * 24 * 30 + 3600 * 1000 * 16);
                            end.setTime(end.getTime() - end.getTime() % (3600 * 1000 * 24 * 30) + 3600 * 1000 * 16);
                            return [start, end];
                        },
                    },
                ],
            },
        };
    },

    methods: {
    },
};
