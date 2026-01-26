/* 图片访问配置 */
import uploadConfig from '@/config/upload';

const imageConfig = {
	defaults: {
		image: '/images/default.png',
		avatar: '/images/user.png',
	},
	generatorUrl: (imagePath) => {
		return uploadConfig.image.generatorUrl(imagePath, 'preview');
	}
};

export default imageConfig;
