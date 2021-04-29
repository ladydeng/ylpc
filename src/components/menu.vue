<template>
  <div>
    <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
      <a-menu-item key="1">
        <a-icon type="pie-chart" />
        <span>Option 1</span>
      </a-menu-item>
      <a-menu-item key="2">
        <a-icon type="desktop" />
        <span>Option 2</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="user" /><span>员工相关</span></span>
        <a-menu-item key="3" >                
          <router-link :to="{ name: 'Staff'}">
            员工信息
          </router-link> 
        </a-menu-item>
        <a-menu-item key="4" @click.native="menuChange('StaffOn')"> 在职员工信息 </a-menu-item>
        <a-menu-item key="5" @click.native="menuChange('StaffOff')"> 离职员工信息 </a-menu-item>
        <a-menu-item key="6" @click.native="menuChange('UsedBankCards')"> 员工信息曾用银行卡 </a-menu-item>
        <a-menu-item key="7" @click.native="menuChange('EmergencyContact')"> 员工紧急联系人 </a-menu-item>
        <a-menu-item key="8" @click.native="menuChange('OncePhone')"> 曾用电话 </a-menu-item>
        <a-menu-item key="9" @click.native="menuChange('Wage')"> 员工工资 </a-menu-item>
        <a-menu-item key="10" @click.native="menuChange('salaryHistory')"> 员工工资历史记录 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="team" /><span>员工绩效相关</span></span>
        <a-menu-item key="11" @click.native="menuChange('performancePayAccounting')"> 绩效工资核算 </a-menu-item>
        <a-menu-item key="12" @click.native="menuChange('accountingContentHistoryController')"> 绩效工资核算历史记录 </a-menu-item>
        <a-menu-item key="13" @click.native="menuChange('accountingContentDictionary')"> 绩效工资核算内容字典 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title"><a-icon type="team" /><span>课程基本信息</span></span>
        <!-- <a-menu-item key="10"> Tom </a-menu-item> -->
        <a-menu-item key="14" @click.native="menuChange('courseInformation')"> 授课基本信息 </a-menu-item>
        <a-menu-item key="27" @click.native="menuChange('courseInfoController')"> 授课基本信息 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"><a-icon type="team" /><span>考勤基础记录</span></span>
        <!-- <a-menu-item key="10"> Tom </a-menu-item> -->
        <a-menu-item key="15" @click.native="menuChange('attendanceInformation')"> 出勤基本信息 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub5">
        <span slot="title"><a-icon type="team" /><span>岗位业绩考核系统</span></span>
        <a-menu-item key="29" @click.native="menuChange('assessmentProject')">人资考核项目列表</a-menu-item>
        <a-menu-item key="32" @click.native="menuChange('technologyAssessment')">技术考核项目列表</a-menu-item>
        <a-menu-item key="16" @click.native="menuChange('generalAssessment')"> 通用考核基本信息 </a-menu-item>
        <a-menu-item key="17" @click.native="menuChange('marketDepartmentAssessment')"> 市场部门考核基本信息 </a-menu-item>
        <a-menu-item key="18" @click.native="menuChange('humanResourceDepartmentAssessment')"> 人力资源部门考核内容 </a-menu-item>
        <a-menu-item key="19" @click.native="menuChange('technicalDepartment')"> 技术部考核内容 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub6">
        <span slot="title"><a-icon type="team" /><span>人力资源业务系统</span></span>
        <a-menu-item key="21"> 客户基本信息 </a-menu-item>
        <a-menu-item key="22"> 邀约面试基本信息 </a-menu-item>
        <a-menu-item key="23"> 退档基本信息 </a-menu-item>
        <a-menu-item key="24"> 入职历史记录基本信息 </a-menu-item>
        <!-- <a-menu-item key="17"> 市场部门考核基本信息 </a-menu-item> -->
      </a-sub-menu>
        <a-menu-item key="25"> 考核算法基本信息 </a-menu-item>
        <a-menu-item key="26" @click.native="menuChange('departmentInformation')"> 部门信息 </a-menu-item>
        <a-menu-item key="28" @click.native="menuChange('postInformation')"> 岗位信息 </a-menu-item>
      <a-sub-menu key="sub7">
        <span slot="title"><a-icon type="team" /><span>OA系统</span></span>
        <a-sub-menu key="sub8">
          <span slot="title"><a-icon type="team" /><span>CRM管理</span></span>
          <a-menu-item key="30" @click.native="menuChange('customerBasicInformation')"> 客户基本信息 </a-menu-item>
          <!-- <a-menu-item key="31"> 教务管理 </a-menu-item> -->
          <!-- <a-menu-item key="23"> 退档基本信息 </a-menu-item>
          <a-menu-item key="24"> 入职历史记录基本信息 </a-menu-item> -->
        <!-- <a-menu-item key="17"> 市场部门考核基本信息 </a-menu-item> -->
        </a-sub-menu>
        <a-sub-menu key="sub9">
          <span slot="title"><a-icon type="team" /><span>教务管理</span></span>
          <a-menu-item key="30" @click.native="menuChange('educationalAdministration')"> 教师课时统计 </a-menu-item>
          <a-menu-item key="31" @click.native="menuChange('')"> 教务会议 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub10">
          <span slot="title"><a-icon type="team" /><span>市场营销</span></span>
          <a-menu-item key="44" @click.native="menuChange('logs')">日志</a-menu-item>
          <a-menu-item key="45" @click.native="menuChange('WorkSummary')">工作总结</a-menu-item>
          <a-menu-item key="46" @click.native="menuChange('ContractApproval')">合同审批</a-menu-item>
          <!-- <a-menu-item key="30" @click.native="menuChange('educationalAdministration')"> 教师课时统计 </a-menu-item>
          <a-menu-item key="31" @click.native="menuChange('pp')"> 教务会议 </a-menu-item> -->
          <!-- <a-menu-item key="31"> 教务管理 </a-menu-item> -->
          <!-- <a-menu-item key="23"> 退档基本信息 </a-menu-item>
          <a-menu-item key="24"> 入职历史记录基本信息 </a-menu-item> -->
        <!-- <a-menu-item key="17"> 市场部门考核基本信息 </a-menu-item> -->
        </a-sub-menu>
        <!-- <a-menu-item key="30"> CRM管理 </a-menu-item> -->
        <!-- <a-menu-item key="31"> 人力资源部考核内容 </a-menu-item>
        <a-menu-item key="32"> 技术考核内容 </a-menu-item> -->
        <!-- <a-menu-item key="17"> 市场部门考核基本信息 </a-menu-item> -->
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
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
 * 2020年12月30日     Bai           v1.0.0              新建：<br>
 * 2020年1月21日      qcc           v1.0.1              添加曾用银行卡相关
 * 2020年01月22日     qcc           v1.0.2              添加紧急联系人相关信息
 * 2020年01月27日     qcc           v1.0.3              添加工资基本信息模块
 * 2020年01月29日     qcc           v1.0.4              添加工资历史记录基本信息模块
 * 2020年02月20日     qcc           v1.0.5              添加员工绩效相关
 * 2020年02月21日     qcc           v1.0.6              添加员工绩效历史记录相关
 * 2020年02月22日     qcc           v1.0.7              添加员工绩效核算内容字典相关/完善菜单栏
 * 2020年02月23日     qcc           v1.0.8              部门相关、授课信息相关、课程信息相关
 * 
 */

export default {
  name: "menu1",
  methods:{
    menuChange(menu) {
      this.componentsVeiw = menu;
      this.$emit("componentsVeiw",menu)  
      // console.log(this.componentsVeiw);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>