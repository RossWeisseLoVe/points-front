
import { defineStore } from 'pinia';


export const useCalculateStore = defineStore('calculate',{
  state: () => ({
    methods: {},
    activeType: undefined,//用于提示当前可以选择的drop
    activeId: undefined,
    sourceObj: undefined,
  }),
  getters: {

  },
  actions: {
    registerMethod(methodName, method) {
      this.methods[methodName] = method;
    },
    callMethod(methodName, ...args) {
      const method = this.methods[methodName];
      if (method && typeof method === 'function') {
        return method(...args);
      } else {
        console.warn(`Method ${methodName} not found in sharedMethods`);
      }
    },
  },
});

