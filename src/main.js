import { createSSRApp } from "vue";
import App from "./App.vue";
import store from '@/stores/index';

import uviewPlus from 'uview-plus';
import MaterialSymbol from '@components/modules/MaterialSymbol';
import VueQrcode from '@chenfengyuan/vue-qrcode'; // 二维码
import print from 'vue3-print-nb'; // 打印

import api from './api/api.js';
import authentication from '@/authentication';
import configs from './config/configs';
import constant from './constant/index';
import uploadConfig from './config/upload';

import uPage from './components/modules/uPage';
import uContainer from './components/modules/uContainer';
import vFormRow from './components/modules/vFormRow/index';
import vViewRow from './components/modules/vViewRow/index';
import vSelect from './components/modules/vSelect/index';

// 公用css
import '@/styles/common/uni.css';
import '@/styles/index.less';

export function createApp() {
	const app = createSSRApp(App);

	app.component('MaterialSymbol', MaterialSymbol);
	app.component(VueQrcode.name, VueQrcode);

	app.component('uPage', uPage);
	app.component('uContainer', uContainer);
	app.component('vFormRow', vFormRow);
	app.component('vViewRow', vViewRow);
	app.component('vSelect', vSelect);

	app.config.globalProperties.$api = api;
	app.config.globalProperties.$user = authentication.user();
	app.config.globalProperties.$auth = authentication.auth;
	app.config.globalProperties.$configs = configs;
	app.config.globalProperties.$constant = constant;
	app.config.globalProperties.$fileUrl = uploadConfig.file.generatorUrl;
	app.config.globalProperties.$imageUrl = uploadConfig.image.generatorUrl;
	app.config.globalProperties.$videoUrl = uploadConfig.video.generatorUrl;

	app.use(store);
	app.use(uviewPlus,  () => {
		return {
			options: {
				// 修改$u.config对象的属性
				config: {
					// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
					unit: 'rpx'
				}
			}
		}
	});
	app.use(print);

	return {
		app,
	};
}
