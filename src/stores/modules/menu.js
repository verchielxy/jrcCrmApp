import menuConfig from '@/config/menu';

function collectAllowMap(tree, map = new Map()) {
	tree.forEach(item => {
		if (item.key) {
			map.set(item.key, item)
		}
		if (Array.isArray(item.children)) {
			collectAllowMap(item.children, map)
		}
	})
	return map
}

function filterAndMergeMenus(menus, allowMap, overrideConfig) {
	return menus
		.map(menu => {
			const allow = allowMap.get(menu.url)

			// 递归子菜单
			const children = Array.isArray(menu.children)
				? filterAndMergeMenus(menu.children, allowMap, overrideConfig)
				: []

			const isAllowed = !!allow

			if (!isAllowed && children.length === 0) {
				return null
			}

			// 合并字段（allows 覆盖 menus）
			let mergedMenu = { ...menu }

			if (allow) {
				Object.keys(overrideConfig).forEach(menuField => {
					const allowField = overrideConfig[menuField]
					if (allow[allowField] !== undefined) {
						mergedMenu[menuField] = allow[allowField]
					}
				})
			}

			if (children.length > 0) {
				mergedMenu.children = children
			}

			return mergedMenu
		})
		.filter(Boolean)
}

const menu = {
	state: () => {
		return {
			all: [],
			main: [],
			list: [],
		};
	},
	mutations: {
		SET_MENUS: (state, menus) => {
			let main = [];
			let list = [];

			const allowMap = collectAllowMap(menuConfig.allows)

			const finalMenus = filterAndMergeMenus(
				menus,
				allowMap,
				menuConfig.overrideFields
			)

			finalMenus.map((item) => {
				if (item.children && item.children.length > 0) {
					list.push(item);
				} else {
					main.push(item);
				}
			});

			// console.log(finalMenus)

			state.all = menus;
			state.main = main;
			state.list = list;
		},
	},
};

export default menu;
