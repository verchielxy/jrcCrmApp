// 设置带过期时间的缓存
export function setStorage(key, value, expireSeconds = 0) {
	const data = {
		value,
		expire: expireSeconds > 0 ? Date.now() + expireSeconds * 1000 : null
	}
	uni.setStorageSync(key, data)
}

// 获取缓存，同时检查是否过期
export function getStorage(key) {
	const data = uni.getStorageSync(key)
	if (!data) return null

	if (data.expire && Date.now() > data.expire) {
		uni.removeStorageSync(key) // 过期删除
		return null
	}

	return data.value
}

// 手动移除指定 key
export function removeStorage(key) {
	uni.removeStorageSync(key)
}

// 清空所有本地缓存
export function clearStorage() {
	uni.clearStorageSync()
}
