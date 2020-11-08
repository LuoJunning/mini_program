// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击子组件通过事件向父组件传递参数
     * @param {*} e
     */
    currentItem(e) {
      // 1 获取index
      const { index } = e.currentTarget.dataset
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("itemTap", { index })
    }
  }
})
