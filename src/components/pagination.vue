<template>
  <div>
    <a-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      @showSizeChange="onShowSizeChange"
      :pageSizeOptions=pageSizeOptions
      :defaultPageSize=defaultPageSize
    />
  </div>
</template>
<script>

/**
 *
 * @Function: pagination.vue
 * @Description: 对外暴露数据
 *
 * @return：name,data(),created()
 * @throws：异常描述
 *
 * @version: v1.0.0
 * @author: qcc
 * @date: 2021年1月18日 上午10:28:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2021年1月18日     qcc             v1.0.0                 分页组件
 */
export default {
  data() {
    return {
      pageSize: 20,
      // 当前页数
      current: 4,
      // 指定每页可以显示多少条
      pageSizeOptions:['50','100','150'],
      // 默认的每页条数
      defaultPageSize:50
    };
  },
  watch: {
    pageSize(val) {
      console.log('pageSize', val);
    },
    current(val) {
      console.log('current', val);
    },
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
  },
};
</script>


