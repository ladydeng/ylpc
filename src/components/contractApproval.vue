<template>
  <a-form-model :model="contract" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="合同编号">
      <a-input v-model="contract.workContent" />
    </a-form-model-item>

    <a-form-model-item label="签约日期">
      <a-date-picker
        v-model="contract.signDate"
        show-time
        type="date"
        placeholder="请选择时间"
        style="width: 100px"
      />
    </a-form-model-item>

    <a-form-model-item label="我方单位名称">
      <a-input v-model="contract.ourUnitName" />
    </a-form-model-item>

    <a-form-model-item label="我方负责人">
      <a-input v-model="contract.ourCharger" />
    </a-form-model-item>

    <a-form-model-item label="对方单位名称">
      <a-input v-model="contract.otherUnitName" />
    </a-form-model-item>

    <a-form-model-item label="对方负责人">
      <a-input v-model="contract.otherCharger" />
    </a-form-model-item>

    <a-form-model-item label="内容">
      <a-input v-model="contract.contet" type="textarea" />
    </a-form-model-item>

    <a-form-model-item>
      <a-upload action="#">
        <a-button> <a-icon type="upload" /> 图片 </a-button>
        <a-button> <a-icon type="upload" /> 附件 </a-button>
      </a-upload>
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
      contract: {
        id: "",
        signDate: "",
        ourUnitName: "",
        ourCharger: "",
        otherUnitName: "",
        otherCharger: "",
        content: "",
        // picture: "",
        // file: "",
      },
    };
  },
  methods: {
    formSubmit() {
      //把数据提交到服务器，并提示是否查看数据，
    },
  },
};
</script>
