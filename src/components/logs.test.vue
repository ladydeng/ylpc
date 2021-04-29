<!--
页面功能：写日志、看日志、统计导出、模板管理
没有对应的后台服务器
-->
<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="看日志" force-render>
        <div style="width: 500px">
          <a-tabs default-active-key="1" tab-position="left">
            <a-tab-pane key="1" tab="全部">
              <div class="userLogs">
                <div
                  v-for="(item, index) in userLogs"
                  :key="index"
                  class="userLogs-item"
                >
                  <!-- 用户名 -->
                  <span class="user-name">{{}}</span>
                  <ul class="user-content">
                    <li class="item-title">{{ item.title }}</li>
                    <li>{{ item.indicators }}</li>
                    <li>{{ item.bug }}</li>
                    <li>{{ item.notSolved }}</li>
                    <li class="item-date">{{ item.date }}</li>
                  </ul>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="未读"> Content of Tab 2 </a-tab-pane>
            <a-tab-pane key="3" tab="我发出的"> Content of Tab 3 </a-tab-pane>
          </a-tabs>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="统计导出">
        <div style="width: 500px">
          <a-tabs default-active-key="1" tab-position="left">
            <a-tab-pane key="1" tab="我管理的"> Content of Tab 1 </a-tab-pane>
            <a-tab-pane key="2" tab="我需要写的"> Content of Tab 2 </a-tab-pane>
          </a-tabs>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="模板管理">
        <div v-if="templateAdmin.length == 0">
          <p>空空如也~</p>
          <a-button
            type="primary"
            class="new-template"
            @click="showTemplateModel"
          >
            <a-icon type="plus" /> 创建新模板
          </a-button>
        </div>
        <div class="template-group" v-else>
          <div
            class="template-group-item first-template-item"
            @click="showTemplateModel"
          >
            <a-icon
              type="plus"
              :style="{ fontSize: '36px' }"
              class="add-logs"
            />
            <h3>模板</h3>
          </div>
          <div
            class="template-group-item"
            v-for="(item, index) in templateAdmin"
            :key="index"
            @click="tempItemClick(item)"
          >
            <div class="real-time-template">
              <header>
                <h3>
                  *<strong>{{ item.title }}</strong>
                </h3>
              </header>
              <section>
                <h4>{{ item.tipsFirst }}</h4>
                <p>``````</p>
                <h4>{{ item.tipsSecond }}</h4>
                <p>``````</p>
                <h4>{{ item.tipsThird }}</h4>
                <p>```````</p>
              </section>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-button
      type="primary"
      icon="edit"
      class="write-logs"
      @click="showlogsModel"
      >写日志</a-button
    >

    <!-- 日志模态框开始 -->
    <!-- bug:已填，但为空:已解决（:model="数据源"，prop="规则名"，） -->
    <a-modal
      :title="showTitle.title"
      :visible="logsVisible"
      :confirm-loading="logsConfirmLoading"
      @ok="logsCreate"
      @cancel="logsCancel"
    >
      <a-form-model ref="logsRuleForm" :model="userLog" :rules="logsRules">
        <a-form-model-item :label="showTitle.indicators" prop="indicators">
          <a-input placeholder="请输入" v-model="userLog.indicators" />
        </a-form-model-item>
        <a-form-model-item :label="showTitle.bug" prop="bug">
          <a-input placeholder="请输入" v-model="userLog.bug" type="textarea" />
        </a-form-model-item>
        <a-form-model-item :label="showTitle.notSolved" prop="notSolved">
          <a-input
            placeholder="请输入"
            v-model="userLog.notSolved"
            type="textarea"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 模态框结束 -->

    <!-- 创建模板模态框开始 -->
    <!-- bug:已填，但为空:已解决（:model="数据源"，prop="规则名"，） -->
    <a-modal
      title="创建新模板"
      :visible="templateVisible"
      :confirm-loading="templateConfirmLoading"
      @ok="templateCreate"
      @cancel="templateCancel"
    >
      <a-form-model
        ref="templateRuleForm"
        :model="realTimeTemplate"
        :rules="templateRules"
      >
        <a-form-model-item label="模板标题" prop="title">
          <a-input placeholder="请输入" v-model="realTimeTemplate.title" />
        </a-form-model-item>
        <a-form-model-item
          label="请输入标题，如【今日已完成工作】"
          prop="tipsFirst"
        >
          <a-input placeholder="请输入" v-model="realTimeTemplate.tipsFirst" />
        </a-form-model-item>
        <a-form-model-item label="请输入标题，如【今日未完成工作】" prop="tipsSecond">
          <a-input placeholder="请输入" v-model="realTimeTemplate.tipsSecond" />
        </a-form-model-item>
        <a-form-model-item
          label="请输入标题，如【需协调工作工作】"
          prop="tipsThird"
        >
          <a-input placeholder="请输入" v-model="realTimeTemplate.tipsThird" />
        </a-form-model-item>
      </a-form-model>
      <div class="show-template">
        <h3>模板展示</h3>
        <div class="real-time-template">
          <header>
            <h3>
              *<strong>{{ realTimeTemplate.title }}</strong>
            </h3>
          </header>
          <section>
            <h4>{{ realTimeTemplate.tipsFirst }}</h4>
            <p>``````</p>
            <h4>{{ realTimeTemplate.tipsSecond }}</h4>
            <p>``````</p>
            <h4>{{ realTimeTemplate.tipsThird }}</h4>
            <p>```````</p>
          </section>
        </div>
      </div>
    </a-modal>
    <!-- 模态框结束 -->
  </div>
</template>

<script>
// import { formatDate } from "@common/utils.js"//找不到
import { formatDate } from "../common/utils";

import axios from "axios";

export default {
  name: "logs",
  data() {
    return {
      // 日志模态框
      logsVisible: false,
      logsConfirmLoading: false, //确定按钮loadig状态

      // 模板模态框
      templateVisible: false,
      templateConfirmLoading: false,

      // 抽屉
      // form: this.$form.createForm(this),
      // drawervisible: false,

      // 存放所有日志模板
      templateAdmin: [],
      
      // 实时模板
      realTimeTemplate: {
        title: "",
        tipsOne: "",
        tipsSecond: "",
        tipsThird: "" 
      },

      // 点击哪个模板，该模板数据传进来
      showTitle: {
        title: "商城系统日记",
        indicators: "今日完成指标",
        bug: "遇到的bug",
        notSolved: "未解决的bug",
      },

      // 所有用户日志----从服务端获取
      userLogs: [],

      // 单个用户日志-----push到服务端
      userLog: {
        title: "",
        indicators: "",
        bug: "",
        notSolved: "",
        date: "",
      },

      //日志校验规则
      logsRules: {
        indicators: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        bug: [{ required: true, message: "不能为空！", trigger: "blur" }],
        notSolved: [{ required: true, message: "不能为空！", trigger: "blur" }],
      },

      //模板校验规则
      templateRules: {
        title: [{ required: true, message: "不能为空！", trigger: "blur" }],
        tipsFirst: [
          { required: true, message: "不能为空！", trigger: "blur" },
        ],
        tipsSecond: [{ required: true, message: "不能为空！", trigger: "blur" }],
        tipsThird: [{ required: true, message: "不能为空！", trigger: "blur" }],
      },
    };
  },
  created() {
    // 当视图开始创建的时候，拿到服务器中所有的日志和日志模板，进行渲染
    // this.logsRequest(this.userLog);
    // this.templateRequest(this.realTimeTemplate);
    console.log(formatDate(new Date(), "yy-MM-dd hh-mm-ss"));
  },
  methods: {
    // 发送网络请求
    /**@function logsRequest 向服务器发送网络请求，把数据传给服务器并接收服务器的响应数据
     * @param {data} 用户日志
     */
    logsRequest(data) {
      axios
        .post("http://192.168.90.29:7999/yl-log/insert", data)
        .then((res) => {
          console.log(res);
          // this.templateAdmin = res.templateAdmin;
          // this.userLogs = res.userLogs;
          console.log("请求成功");
        });
    },
    /**@function templateRequest 向服务器发送网络请求，把数据传给服务器并接收服务器的响应数据
     * @param {data} 用户m模板
     */
    templateRequest(data) {
      axios
        .post("http://192.168.90.29:7999/yl-log/insert", data)
        .then((res) => {
          console.log(res);
          // this.templateAdmin = res.templateAdmin;
          // this.userLogs = res.userLogs;
          console.log("请求成功");
        });
    },
    // 模态框
    showlogsModel() {
      this.logsVisible = true;
    },
    logsCreate() {
      // 不能为空验证
      this.$refs.logsRuleForm.validate((valid) => {
        if (valid) {
          this.logsConfirmLoading = true;
          this.userLog.title = this.showTitle.title;
          this.userLog.date = new Date();
          this.userLogs.push(this.userLog); //服务端
          // 如果不为空，则把用户数据保存在userLog对象，并把这个对象传给后台
          this.logsRequest(this.userLog);
          setTimeout(() => {
            alert("提交成功！");
            this.logsVisible = false;
            this.logsConfirmLoading = false;
            this.userLog = {};
          }, 500);
        } else {
          //否则模态框开启
          console.log("提交失败");
          this.logsVisible = true;
          return false;
        }
      });
    },
    logsCancel() {
      this.logsVisible = false;
    },
    // 模态框
    showTemplateModel() {
      this.templateVisible = true;
    },
    templateCreate() {
      // 不能为空验证
      this.$refs.templateRuleForm.validate((valid1) => {
        if (valid1) {
          this.templateConfirmLoading = true;
          this.templateAdmin.push(this.realTimeTemplate); //服务端
          /**
           * //把用户创建的模板发送给服务端
           * this.templateRequest(this.realTimeTemplate)
           */
          this.templateRequest(this.realTimeTemplate);
          setTimeout(() => {
            alert("提交成功！");
            this.templateVisible = false;
            this.templateConfirmLoading = false;
            this.realTimeTemplate = {};
          }, 500);
        } else {
          //否则模态框开启
          console.log("提交失败");
          this.templateVisible = true;
          return false;
        }
      });
    },
    templateCancel() {
      this.templateVisible = false;
    },

    //当用户点击创建好的模板，进入写日志
    tempItemClick(item) {
      this.logsVisible = true;
      this.showTitle.title = item.title;
      this.showTitle.indicators = item.tipsFirst;
      this.showTitle.bug = item.tipsSecond;
      this.showTitle.notSolved = item.tipsThird;
    },
  },
};
</script>

<style scoped>
li {
  list-style: none;
}

.new-template {
  border-radius: 20px;
  margin-top: 50vh;
}

.write-logs {
  position: absolute !important;
  top: 20vh;
  right: 5vw;
  border-radius: 20px;
  padding: 5px;
}

.template-group {
  width: 100%;
  height: 100%;
}

.template-group-item {
  width: 150px;
  height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgb(216, 216, 216);
  float: left;
  margin-left: 10px;
  margin-bottom: 10px;
}

.add-logs {
  margin-top: 60px;
  margin-bottom: 10px;
}

.template-group-item h3 {
  font-size: 18px;
}

.real-time-template {
  width: 150px;
  height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgb(216, 216, 216);
  padding: 8px;
  overflow: hidden;
}

.real-time-template h3 {
  border-bottom: 1px solid rgb(216, 216, 216);
  margin-top: 5px;
}

.real-time-template h4,
.real-time-template p {
  font-size: 12px;
}

div.ant-tabs-tab {
  background: blue !important;
}

.userLogs {
  width: 100%;
  height: 100%;
}

.userLogs-item {
  width: 100%;
  height: auto;
  border: 1px solid black;
  display: flex;
}

.user-name {
  flex: 2;
}

.user-content {
  flex: 8;
  text-align: left !important;
}

.item-date {
  text-align: right !important;
}
</style>