/* 引入基础的管理模块 */
import auth from './auth/index';

/* 以下是业务模块，可更新修改 */
import business from './business/index';


const api = {
	auth,
	...business,
};

export default api;
