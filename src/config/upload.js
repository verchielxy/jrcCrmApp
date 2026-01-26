import serverUrl from '@api/serviceUrl';
import authentication from '@/authentication';

/* 上传配置 */
const uploadConfig = {
	config: {
		// 上传图片时候，request 的 header 统一添加的参数
		headers: () => {
			const headers = {};
			const xAuthToken = authentication.token();
			if (xAuthToken) {
				headers[authentication.tokenKey()] = xAuthToken;
			}

			return headers;
		},
		// 上传图片时候，request 的 body data 统一添加的参数
		params: () => {
			const user = authentication.user();
			const params = {
				biz: user ? user.value.id : 'tmp',
			};
			return params;
		},
		responseIsSuccess: (response) => {
			return response && response.code === 0;
		},
		responseGetValue: (response) => {
			let result;
			if (response && response.result) {
				result = response.result;
			}
			return result;
		},
		responseGetFileUrl: (response) => {
			let result;
			if (response && response.result) {
				result = response.result;
			}
			return result;
		},
		responseGetMessage: (response) => {
			let result = '服务器未知错误';
			if (response && response.result) {
				result = response.result.message;
			}
			return result;
		},
	},
	file: {
		// 上传文件的的input file key
		key: 'file',
		url: serverUrl + '/api/sys/common/upload',
		download: serverUrl + '/api/sys/common/static',
		preview: serverUrl + '/api/sys/common/static',
		accepts: [
			'jpg', 'png', 'gif', 'txt', 'rtf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'pdf',
		],
		size: '10', // MB
	},
	image: {
		// 上传图片的的input file key
		key: 'file',
		url: serverUrl + '/api/sys/common/upload',
		download: serverUrl + '/api/sys/common/static',
		preview: serverUrl + '/api/sys/common/static',
		accepts: [
			'jpg', 'png', 'gif',
		],
		size: '10', // MB
	},
	video: {
		// 上传视屏的的input file key
		key: 'file',
		url: serverUrl + '/api/sys/common/upload',
		download: serverUrl + '/api/sys/common/static',
		preview: serverUrl + '/api/sys/common/static',
		accepts: [
			'mp4', 'mpeg', 'avi',
		],
		size: '10', // MB
	},
	// 文件类型
	fileTypes: {
		image: ['image/*'],
		jpg: ['image/jpeg', 'image/jpg'],
		png: ['image/png'],
		gif: ['image/gif'],
		video: ['video/*', 'audio/*'],
		mp3: ['audio/mp3'],
		mp4: ['video/mp4', 'audio/mp4'],
		mpeg: ['video/mpeg', 'audio/mpeg'],
		avi: ['video/x-msvideo'],
		txt: ['text/plain'],
		rtf: ['application/rtf'],
		doc: ['application/msword'],
		docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
		xls: ['application/vnd.ms-excel'],
		xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
		ppt: ['application/vnd.ms-powerpoint'],
		pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
		zip: ['application/zip'],
		rar: ['application/octet-stream'],
		pdf: ['application/pdf'],
	}
};

// 生成文件的 下载链接 预览链接
uploadConfig.file.generatorUrl = (path, type = 'download') => {
	if (!path) {
		return '';
	}

	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	return uploadConfig.file[type] + path;
}

// 生成图片的 下载链接 预览链接
uploadConfig.image.generatorUrl = (path, type = 'download') => {
	if (!path) {
		return '';
	}

	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	return uploadConfig.image[type] + path;
}

// 生成视频的 下载链接 预览链接
uploadConfig.video.generatorUrl = (path, type = 'download') => {
	if (!path) {
		return '';
	}

	if (!path.startsWith('/')) {
		path = '/' + path;
	}

	return uploadConfig.video[type] + path;
}

export default uploadConfig;
