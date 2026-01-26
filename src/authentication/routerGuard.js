import pagesMap from '@/pagesMap';
import authentication from '@/authentication';
import configs from '@/config/configs';
import { isNullOrUndefined } from '@utils/tools'

function normalizePath(url) {
	if (url === '/' || url === '#/') {
		return configs.homeOptions.page;
	}
	return url;
}

function findPageMeta(url) {
	url = normalizePath(url);
	return pagesMap.find(p => url.startsWith(p?.path))?.meta || {};
}

function hasToken() {
	return !isNullOrUndefined(authentication.token());
}

function handleGuard(url) {
	const meta = findPageMeta(url);

	if (meta.requiresAuth && !hasToken()) {

		uni.redirectTo({
			url: `${configs.loginOptions.page}?redirect=${encodeURIComponent(url)}`
		})
		return false;
	}

	authentication.syncUserData();

	return true;
}

export async function initRouterGuard() {
	// 拦截 API 导航调用
	const interceptApis = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
	interceptApis.forEach(type => {
		uni.addInterceptor(type, {
			invoke(args) {
				return handleGuard(args.url);
			}
		})
	})

	// 针对 H5：监听 hash 变化（浏览器地址栏跳转）
	if (process.env.UNI_PLATFORM === 'h5') {
		const checkHash = () => {
			const hash = decodeURIComponent(location.hash.replace(/^#/, '').split('?')[0])
			handleGuard(hash)
		}

		const rawPushState = history.pushState
		history.pushState = function (...args) {
			const result = rawPushState.apply(this, args)
			checkHash()
			return result
		}

		window.addEventListener('popstate', checkHash)
		checkHash()
	}
}
