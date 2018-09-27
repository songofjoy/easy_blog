import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const vuexPersisted = new createPersistedState({
    key: 'cache_key',
    storage: window.localStorage,
    paths: ['app.plan_grey_status'],
});


const store = new Vuex.Store({
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
    },

    plugins: [vuexPersisted],
});

export default store;
