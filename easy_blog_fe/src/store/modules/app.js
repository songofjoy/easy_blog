import {appRouter} from '@/router/router';

const app = {
    state: {
        menuList: [],
        routers: [
            ...appRouter,
        ],
        plan_grey_status: false,
    },
    getters: {
        plan_grey_status: state => state.plan_grey_status,
    },
    actions: {
        set_grey_status ({ commit, state }, grey_status) {
            commit('SET_GREY_STATUS', grey_status);
        },
    },
    mutations: {
        updateMenulist (state) {
            state.menuList = appRouter;
        },
        ['SET_GREY_STATUS'] (state, grey_status) {
            state.plan_grey_status = grey_status;
        },
    },
};

export default app;
