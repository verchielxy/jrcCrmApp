import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const piniaStore = createPinia();
piniaStore.use(createPersistedState());

export { piniaStore };

export * from './base';

export default piniaStore;