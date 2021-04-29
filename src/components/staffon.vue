<template>
  <a-table :columns="columns" :data-source="staffTable" :loading="tableLoading">
    <a slot="action" slot-scope="" href="javascript:;">Delete</a>
    <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
      <!-- 专业：{{ record.major }} | 在职状态：{{ record.positionStatus
      }}<br />毕业院校：{{ record.univesity }}<br /> -->
      <a-descriptions title="详细信息">
        <a-descriptions-item label="出生日期">
          {{ record.birthday }}
        </a-descriptions-item>
        <a-descriptions-item label="身份证号">
          {{ record.userCard }}
        </a-descriptions-item>
        <a-descriptions-item label="学历">
          {{ record.education }}
        </a-descriptions-item>
        <a-descriptions-item label="毕业院校">
          {{ record.univesity }}
        </a-descriptions-item>
        <a-descriptions-item label="专业">
          {{ record.major }}
        </a-descriptions-item>
        <a-descriptions-item label="入职时间">
          {{ record.entryTime }}
        </a-descriptions-item>
        <a-descriptions-item label="工作时限/(合同期)">
          {{ record.workScheduleTolerance }}年
        </a-descriptions-item>
        <a-descriptions-item label="开户银行">
          {{ record.bank }}
        </a-descriptions-item>
        <a-descriptions-item label="银行卡号">
          {{ record.bankCard }}
        </a-descriptions-item>
        <a-descriptions-item label="家庭住址">
          {{ record.address }}
        </a-descriptions-item>
        <a-descriptions-item label="合同开始时间">
          {{ record.contractStartDate }}
        </a-descriptions-item>
        <a-descriptions-item label="合同结束时间">
          {{ record.contractEndDate }}
        </a-descriptions-item>
        <a-descriptions-item label="合同备注">
          {{ record.contractRemarks == null ||record.contractRemarks == '' ? "暂无":record.contractRemarks }}
        </a-descriptions-item>
        <a-descriptions-item label="离职日期">
          {{ record.departure == null || record.departure =='' ? "暂无":record.departure }}
        </a-descriptions-item>
      </a-descriptions>
    </p>
  </a-table>
</template>

<script>
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: staff.vue
 * @Description: 员工基本信息可展开表格(数据完整无状态)
 *
 * @version: v1.1.0
 * @author: Bai
 * @date: 2021年1月12日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2020年1月12日     Bai             v1.0.0              新建<br>
 */
import axios from "axios";
/* 本页属性 表格列头*/
const columns = [
  // { title: "ID", dataIndex: "id", key: "id" },
  { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "性别", dataIndex: "sex", key: "sex" },
  { title: "岗位", dataIndex: "station", key: "station" },
  { title: "部门", dataIndex: "department", key: "department" },
  { title: "移动电话", dataIndex: "mobile", key: "mobile" },
  { title: "在职状态", dataIndex: "positionStatus", key: "positionStatus"},
];
/* 本页属性 表格数据源*/
var staffTable = [];

/**
 *
 * @Function: staff.vue
 * @Description: 对外暴露数据
 *
 * @return：name,data(),created()
 * @throws：异常描述
 *
 * @version: v1.0.0
 * @author: Bai
 * @date: 2021年1月12日 上午10:28:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2021年1月12日      Bai             v1.0.0            新建<br>
 */
export default {
  /**
   * name:组件名称
   */
  name: "staffoff",
  data() {
    return {
      //表格数据源
      staffTable,
      //列头基础信息
      columns,
      //表格加载状态动画
      tableLoading: true,
      //logog图片地址
      imgUrl: require("@/assets/logo.png"),
      //
      
    };
  },
  created() {
    //设置vue对象
    var then = this;
    //异步访问staff数据
    axios
      //post处理传递单个参数使用url拼路径模式方式，多个参数可以使用data对象配合application/x-www-form-urlencoded方式组合提交
      /** 利用反向代理访问地址 **/
      .post("/api/findAllPositionStatus",'positionStatus=在职')
      .then(function (response) {
        //获取响应结果
        var res = response.data;
        /* 响应正常，数据正常/数据异常 */
        if (response.status == 200) {
          //更改装载动画状态
          then.tableLoading = false;
        }
        //更新数据
        then.staffTable = res;
      })
      .catch(function (err) {
        //响应异常处理方式
        then.tableLoading = false;
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>