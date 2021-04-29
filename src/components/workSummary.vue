<template>
  <a-form-model :model="workSummary" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="选择部门">
      <a-select
        placeholder="请选择部门"
        v-model="workSummary.department"
        style="width: 200px"
      >
        <a-select-option value="人事部"> 人事部 </a-select-option>
        <a-select-option value="财务部"> 财务部 </a-select-option>
        <a-select-option value="技术部"> 技术部 </a-select-option>
        <a-select-option value="营销部"> 营销部 </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="开始时间">
      <a-date-picker
        v-model="workSummary.startDate"
        show-time
        type="date"
        placeholder="请选择时间"
        style="width: 100px"
      />
    </a-form-model-item>

    <a-form-model-item label="结束时间">
      <a-date-picker
        v-model="workSummary.endDate"
        show-time
        type="date"
        placeholder="请选择时间"
        style="width: 100px"
      />
    </a-form-model-item>

    <a-form-model-item label="主要工作内容">
      <a-input v-model="workSummary.workContent" />
    </a-form-model-item>

    <a-form-model-item label="完成情况">
      <a-radio-group v-model="workSummary.isfinish">
        <a-radio value="1"> 已完成 </a-radio>
        <a-radio value="2"> 未完成 </a-radio>
      </a-radio-group>
    </a-form-model-item>

    <a-form-model-item label="存在不足与计划">
      <a-input v-model="workSummary.plans" type="textarea" />
    </a-form-model-item>

    <a-form-model-item label="后续目标与展望">
      <a-input v-model="workSummary.goals" type="textarea" />
    </a-form-model-item>

    <a-form-model-item label="备注">
      <a-input v-model="workSummary.remarks" type="textarea" />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="formSubmit">提交</a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      workSummary: {
        department: "",
        startDate: "",
        endDate: "",
        workContent: "",
        isfinish: "",
        plans: "",
        goals: "",
        remarks: "",
      },
    };
  },
  methods: {
    formSubmit() {
      //把用户数据提交到服务器，并提示是否查看数据，
    },
  },
};
</script>
