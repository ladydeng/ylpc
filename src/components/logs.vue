<template>
  <div class="logs">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="看日志">
        <!-- 表格开始 -->
        <a-table
          :columns="columns"
          :data-source="userData"
          :rowKey="
            (item, index) => {
              return index;
            }
          "
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
        <!-- {{ userData }} -->
        <!-- 表格结束 -->
      </a-tab-pane>
      <a-tab-pane key="2" tab="写日志" force-render>
        <!-- 表单开始 -->
        <a-form-model
          ref="logsRuleForm"
          :model="userLog"
          :rules="logsRules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-form-model-item label="日志编号：" prop="id">
            <a-input placeholder="请输入" v-model="userLog.id" />
          </a-form-model-item>
          <a-form-model-item label="统计导出:" prop="countDerive">
            <a-input placeholder="请输入" v-model="userLog.countDerive" />
          </a-form-model-item>
          <a-form-model-item label="看日志:" prop="readLog">
            <a-input placeholder="请输入" v-model="userLog.readLog" />
          </a-form-model-item>
          <a-form-model-item label="模板管理:" prop="templateAdmin">
            <a-input placeholder="请输入" v-model="userLog.templateAdmin" />
          </a-form-model-item>
          <a-form-model-item label="写日志:" prop="writeLog">
            <a-input placeholder="请输入" v-model="userLog.writeLog" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit"> Submit </a-button>
          </a-form-model-item>
        </a-form-model>
        <!-- 表单结束 -->
      </a-tab-pane>
      <a-tab-pane key="3" tab="模板管理"> Content of Tab Pane 3 </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: "logs",
  data() {
    return {
      userData: [],
      userLog: {
        countDerive: "",
        id: "",
        readLog: "",
        templateAdmin: "",
        writeLog: "",
      },
      columns: [
        {
          title: "id",
          dataIndex: "id",
          key: "id",
          scopedSlots: { customRender: "id" },
          width: 80,
          rowKey: "id",
        },
        {
          title: "countDerive", //表格头
          dataIndex: "countDerive", //a-table会自动循环data-source的数据，这里写的是改数据的属性
          key: "countDerive", //唯一标识
          ellipsis: true, //重点显示的样式
        },
        {
          title: "readLog",
          dataIndex: "readLog",
          key: "readLog",
          ellipsis: true,
        },
        {
          title: "templateAdmin",
          dataIndex: "templateAdmin",
          key: "templateAdmin",
          ellipsis: true,
        },
        {
          title: "writeLog",
          dataIndex: "writeLog",
          key: "writeLog",
          ellipsis: true,
        },
      ],
      //日志校验规则
      logsRules: {
        id: [{ required: true, message: "不能为空！", trigger: "blur" }],
        countDerive: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        readLog: [{ required: true, message: "不能为空！", trigger: "blur" }],
        templateAdmin: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        writeLog: [{ required: true, message: "不能为空！", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getAllData()
  },
  methods: {
    // 获取页面所有数据
    getAllData() {
      this.axios.get("http://192.168.90.29:7999/yl-log/findAll").then((res) => {
        this.userData = res.data;
      });
    },
    // 提交日志的网络请求
    logSubmit(data) {
      this.axios
        .post("http://192.168.90.29:7999/yl-log/insertAll", data)
        .then((res) => {
          console.log("submit:" + res)
        });
    },
    onSubmit() {
      // 不能为空验证
      this.$refs.logsRuleForm.validate((valid) => {
        if (valid) {
          // 如果不为空，则发送请求，并把userLog传给后台
          this.logSubmit(this.userLog);
          setTimeout(() => {
            alert("提交成功！");
            this.getAllData()
            this.userLog = {};
          }, 500);
        } else {
          //否则模态框开启
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
</style>
