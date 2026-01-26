const user = {
  state: () => {
    return {
      user: {},
      roles: [],
      authoritys: [],
      department: {},
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_AUTHORITYS: (state, authoritys) => {
      state.authoritys = authoritys;
    },
    SET_DEPARTMENT: (state, department) => {
      state.department = department;
    },
  },
};

export default user;
