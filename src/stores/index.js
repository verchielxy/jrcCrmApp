import { createStore } from 'vuex';

import user from './modules/user';
import menu from './modules/menu';
import common from './modules/common';

export default createStore({
  modules: {
    user,
	  menu,
    common,
  },
  state: () => {
    return {
    }
  },
  mutations: {
  },
  actions: {},
  getters: {
    //用户相关
    user: (state) => state.user.user,
    roles: (state) => state.user.roles,
    authoritys: (state) => state.user.authoritys,
    department: (state) => state.user.department,

	  // 菜单相关
	  menuAll: (state) => state.menu.all,
	  menuMain: (state) => state.menu.main,
	  menuList: (state) => state.menu.list,
  },
});


