<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo-container">
        <a-avatar class='.a-avatar' src="/img/logo.png" />
      </div>
      <!-- 菜单组件引入 -->
      <Menu @componentsVeiw='toggle($event)'>
      </Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0" >
          <!-- 渲染面包屑展示 -->
          <a-breadcrumb-item v-bind="headpath" v-for="(title,index) in headpath" v-bind:key="index">{{title.name}}</a-breadcrumb-item>
        </a-breadcrumb>
        
        <div :is="componentsVeiw" :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <!-- 主体内容引入 -->
        </div>
      </a-layout-content>
      <!-- <pagination></pagination> -->
      <a-layout-footer style="text-align: center">
        Copyright (c) 2020 云邻信息科技
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
// @ is an alias to /src
// import Staff from "@/components/staff.vue";
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: menu.vue
 * @Description: 缩起内嵌菜单(数据完整无状态)
 *
 * @version: v1.0.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年01月29日      qcc           v1.0.0             引入组件历史工资记录
 * 2021年02月20日      qcc           v1.0.1             员工绩效相关/绩效工资核算
 * 2021年02月22日      qcc           v1.0.2             绩效工资核算内容字典相关/授课基本信息页面的编写/出勤基本信息页面的
 * 2021年02月24日      qcc           v1.0.3             岗位基本信息页面
 * 2021年03月01日      qcc           v1.0.4             考核项目列表
 * 
 */
import Menu from "@/components/menu.vue";
import Staff from "@/components/staff.vue";
import StaffOn from "@/components/staffon.vue";
import StaffOff from "@/components/staffoff.vue";
import UsedBankCards from "@/components/usedBankCards.vue";
import EmployeeMessage from "@/components/employeeMessage.vue";
import EmergencyContact from "@/components/emergencyContact.vue";
import OncePhone from "@/components/oncePhone.vue";
import Wage from "@/components/wage.vue";
import SalaryHistory from "@/components/salaryHistory.vue"
import PerformancePayAccounting from "@/components/performancePayAccounting.vue"
import accountingContentHistoryController from "@/components/accountingContentHistoryController.vue"
import AccountingContentDictionary from "@/components/accountingContentDictionary.vue"
import CourseInformation from "@/components/courseInformation.vue"
import AttendanceInformation from "@/components/attendanceInformation.vue"
import DepartmentInformation from "@/components/departmentInformation.vue"
import CourseInfoController from "@/components/courseInfoController.vue"
import PostInformation from "@/components/postInformation.vue"
import GeneralAssessment from "@/components/generalAssessment.vue"
import MarketDepartmentAssessment from "@/components/MarketDepartmentAssessment.vue"
import HumanResourceDepartmentAssessment from "@/components/humanResourceDepartmentAssessment.vue"
import AssessmentProject from "@/components/assessmentProject.vue"
import CustomerBasicInformation from "@/components/customerBasicInformation.vue"
import EducationalAdministration from "@/components/educationalAdministration.vue"
import TechnicalDepartment from "@/components/technicalDepartment.vue"
import TechnologyAssessment from "@/components/technologyAssessment.vue"
import Logs from "@/components/logs.vue"
import WorkSummary from "@/components/workSummary.vue"
import ContractApproval from "@/components/contractApproval.vue"
import PP from "@/components/pp.vue"


// 引入分页
import Pagination from "@/components/pagination.vue";


export default {
  name: "Home",
  data() {
    return {
      componentsVeiw:'Logs',
      headpath:[{name:'员工信息'},{name:'员工总表'},{name:'员工基本信息可展开表格'}],
      collapsed: false,
    };
  },components: {
    Staff,
    StaffOn,
    StaffOff,
    Menu,
    UsedBankCards,
    EmergencyContact,
    OncePhone,
    Wage,
    SalaryHistory,
    PerformancePayAccounting,   // 绩效工资核算
    accountingContentHistoryController,    // 绩效工资核算内容历史相关
    AccountingContentDictionary,       // 绩效工资核算内容字典相关
    CourseInformation,       // 授课基本信息
    AttendanceInformation,          // 出勤基本信息
    DepartmentInformation,        // 部门信息
    CourseInfoController,       // 课程相关信息
    PostInformation,          // 岗位基本信息
    GeneralAssessment,        // 通用考核基本信息
    MarketDepartmentAssessment,       // 市场部门考核信息
    HumanResourceDepartmentAssessment,     // 人力资源部门考核内容
    AssessmentProject,         // 考核项目列表
    CustomerBasicInformation,   // 客户基本信息
    EducationalAdministration,      // 教师课时统计
    TechnicalDepartment,           // 技术部考核
    TechnologyAssessment,           // 技术部考核项目列表
    // Pagination
    Logs,    //日志
    WorkSummary,   //工作总结
    ContractApproval    //合同审批
  },mounted(){
    // this.$on("componentsVeiw",(data)=>{
    //     // this.componentsVeiw = data
    //     console.log(data)
    // })
  },
    methods:{
      // 导航切换
      toggle(data) {
        // console.log(data);
        this.componentsVeiw = data
      },

    }
};
</script>
<style scoped>
/* logo容器 */
.logo-container {
  height: 32px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px;
  line-height: 32px;
}
/* 面包屑组件文字位置 - #app默认内容居中 */
.a-avatar {
  height: 120px;
  width: 120px;
}
/* 面包屑组件文字位置 - #app默认居中 */
.ant-breadcrumb{
  text-align: left;
}

</style>