/**
 * @description 获取文件实体的Base64
 * @param {File} file - 文件
 * @return {String} 返回Base64字符串
 */
export function getBase64FromFile (file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

/**
 * @description 根据文件url，获取文件名
 * @param {String} url - 文件链接
 * @return {String} 返回文件的文件名
 */
export function getFileNameFromFilePath(url) {
	return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * @description 根据文件url，获取文件后缀名
 * @param {String} url - 文件链接
 * @return {String} 返回文件的后缀名
 */
export function getFileSuffixFromFilePath(url) {
	return url.substring(url.lastIndexOf('.') + 1);
}

/**
 * @description 根据文件url，返回文件类型
 * @param {String} url - 文件链接
 * @return {String} 返回文件的类型
 * @return 数据返回 1) 匹配图片 - image
 * @return 数据返回 2) 匹配 txt - txt
 * @return 数据返回 3) 匹配 excel - excel
 * @return 数据返回 4) 匹配 word - word
 * @return 数据返回 5) 匹配 pdf - pdf
 * @return 数据返回 6) 匹配 ppt - ppt
 * @return 数据返回 7) 匹配 视频 - video
 * @return 数据返回 8) 匹配 音频 - audio
 * @return 数据返回 9) 其他匹配项 - other
 */
export function getFileTypeFromFilePath(url) {
	let suffix = '';
	let result = '';
	try {
		suffix = getFileSuffixFromFilePath(url);
	} catch (err) {
		return '';
	}

	let types = {
		image: ['png', 'jpg', 'jpeg', 'bmp', 'gif'],
		txt: ['text', 'txt', 'rtf'],
		excel: ['xls', 'xlsx'],
		word: ['doc', 'docx'],
		pdf: ['pdf'],
		ppt: ['ppt', 'pptx'],
		compressed: ['zip', 'rar', '7z'],
		video: ['mp4', 'mpeg', 'mpg', 'avi', 'wmv'],
		audio: ['mp3', 'flac'],
	}
	for (let key in types) {
		result = types[key].some(function (item) {
			return item === suffix;
		});
		if (result) {
			result = key;
			break;
		}
	}
	if (!result) {
		result = 'other';
	}
	return result;
}

/**
 * @description 根据文件url，返回文件类型的icon
 * @param {String} url - 文件链接
 * @return {String} 返回文件类型对应的icon
 */
export function getFileIconFromFilePath(url) {
	let defaultIcon = 'FileOutlined';
	let fileType = getFileTypeFromFilePath(url);
	let icons = {
		image: 'PictureOutlined',
		txt: 'FileTextOutlined',
		excel: 'FileExcelOutlined',
		word: 'FileWordOutlined',
		pdf: 'FilePdfOutlined',
		ppt: 'FilePptOutlined',
		compressed: 'FileZipOutlined',
		video: 'VideoCameraOutlined',
		audio: 'FileOutlined',
		other: 'FileOutlined',
	};

	return icons[fileType] ? icons[fileType] : defaultIcon;
}
