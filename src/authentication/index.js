import store from '@/stores/index';
import configs from '@/config/configs';
import authConfig from '@/config/auth';
import authApi from '@api/auth/index';
import { computed } from 'vue';
import { setStorage, getStorage, removeStorage } from '@/utils/storage';

class authentication {

	constructor() {
	}

	static async getUserInfo() {

		await authApi.userAsync(true, { roles: true, departments: true, }).then((res) => {

			const responseUser = res.result.userInfo;
			const responseAuthoritys = res.result.auth;
			const responseMenus = res.result.menu;

			if (responseUser.departmentList && responseUser.departmentList.length > 0) {
				responseUser.department = responseUser.departmentList[0]
			}
			if (responseUser.roleList && responseUser.roleList.length > 0) {
				responseUser.role = responseUser.roleList[0]
			}

			store.commit('SET_USER', responseUser);
			store.commit('SET_AUTHORITYS', responseAuthoritys);
			store.commit('SET_MENUS', responseMenus);
			uni.setStorageSync('USER', responseUser);
			uni.setStorageSync('AUTHORITYS', responseAuthoritys);
			uni.setStorageSync('MENUS', responseMenus);

		}).catch((err) => {
			// console.log(err);
			store.commit('SET_USER', {});
			store.commit('SET_AUTHORITYS', []);
			store.commit('SET_MENUS', []);
		});
	}

	static syncUserData () {
		const responseUser = uni.getStorageSync('USER');
		const responseAuthoritys = uni.getStorageSync('AUTHORITYS');
		const responseMenus = uni.getStorageSync('MENUS');

		if (responseUser) {
			store.commit('SET_USER', responseUser);
		}
		if (responseAuthoritys) {
			store.commit('SET_AUTHORITYS', responseAuthoritys);
		}
		if (responseMenus) {
			store.commit('SET_MENUS', responseMenus);
		}
	}

	static tokenKey() {
		return authConfig.tokenKey;
	}

	static token() {
		return getStorage(authConfig.tokenKey);
	}

	static async check() {
		await authApi.userAsync(true, { roles: true, departments: true, }).then((res) => {

			return true;

		}).catch((err) => {
			// console.log(err);
		});

		return false;
	}

	static user() {
		const user = computed(() => {
			return store.getters.user;
		});

		return user;
	}

	static menus() {
		const menus = computed(() => {
			return {
				all: store.getters.menuAll,
				main: store.getters.menuMain,
				list: store.getters.menuList,
			};
		});

		return menus;
	}

	static authoritys() {
		const authoritys = computed(() => {
			return store.getters.authoritys;
		});
		return authoritys;
	}

	static auth(key) {
		let permission = false;
		const authoritys = computed(() => {
			return store.getters.authoritys;
		});

		authoritys.value.map(function (item) {
			if (item.action === key) {
				permission = true;
			}
		})

		return permission;
	}

	/* 登录成功后处理 */
	static async signinHandle(response) {
		let xAuthToken = response.result.token;
		if (xAuthToken) {
			setStorage(authConfig.tokenKey, xAuthToken, authConfig.tokenTime);
			await this.getUserInfo();
		} else {
			Promise.reject('no token received');
		}
	}

	/* 登出成功后处理 */
	static signoutHandle(response) {
		store.commit('SET_USER', {});
		store.commit('SET_AUTHORITYS', []);
		removeStorage(authConfig.tokenKey);
		removeStorage('USER');
		removeStorage('AUTHORITYS');

		uni.redirectTo({
			url: configs.logoutOptions.redirectPage,
		})
	}
}

export default authentication;
