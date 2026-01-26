import { defineStore } from 'pinia';
import { useWindowSize } from '@vueuse/core';

const { width, height } = useWindowSize();

const state = {
  bodyHeight: height,
  bodyWidth: width,
};

export const useBaseStore = defineStore('base', {
  state: () => state,
  getters: {
    getBodyHeight: (state) => state.bodyHeight,
    getBodyWidth: (state) => {
      return state.bodyWidth - 64;
    },
  },
  actions: {},
  persist: true,
});
