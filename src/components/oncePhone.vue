<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addemergencyContact" type="primary">添加紧急联系人信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="oncePhoneSearch" />
                </div>
                <!-- <div class="idSearch">
                    <a-input-search @change="contactIdChange" v-model="contactId" style="width: 240px" placeholder="请输入您要查询的id" enter-button @search="contactIdSearch" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="oncephoneVisible" :title="isAdd ? '添加紧急联系人信息':'修改紧急联系人信息'"  @ok="handleOk('formData')" >
                    <a-form-model :rules="rules" ref="formData" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd"  label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop= "contactName" required label="紧急联系人">
                            <a-input v-model="formData.contactName" />
                        </a-form-model-item> -->
                        <a-form-model-item prop="phoneNumber" required label="电话">
                            <a-input v-model="formData.phoneNumber" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop="contactRelationship" required label="关系">
                            <a-input v-model="formData.contactRelationship" />
                        </a-form-model-item> -->
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="oncePhoneTable">
            <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
            <template slot="operation" slot-scope="text,record">
                <i @click="editor(record)">编辑</i> | <i @click="del(record)">删除</i>
            </template>
        </a-table>
    </div>
</template>

<script>
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: usedBankCards.vue
 * @Description: 员工层用卡信息
 * 
 *
 * @version: v1.1.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年1月21日      qcc           v1.1.0              新建页面、
 * /
import axios from "axios";
/* 本页属性 表格列头*/
import axios from 'axios'
import qs from 'qs'
import {validateMobile} from "@/assets/js/vaildate.js";
// 手机验证规则
var validatorMobile = (rule,value,callback) =>{
  if(!value) {
    return callback(new Error('手机号码不能为空'))
  } else {
    if(validateMobile(value)) {
      callback()
    } else {
      return callback(new Error('手机号码格式不正确'))
    }
  }
};
const columns = [
//   { title: "ID", dataIndex: "id", key: "id" },
  { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
//   { title: "紧急联系人", dataIndex: "contactName", key: "contactName" },
  { title: "电话", dataIndex: "phoneNumber", key: "phoneNumber" },
//   { title: "关系", dataIndex: "contactRelationship", key: "contactRelationship" },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var oncePhoneTable = [];

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
 * @date: 2020年12月30日 上午10:28:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2021年01月22日      qcc            v1.0.0            新建紧急联系人组件                                                           
 *                                                      获取、添加紧急联系人信息
 * 
 */
export default {
  /**
   * name:组件名称
   */
  name: "usedBankCards",
  data() {
    return {
        //logog图片地址
        imgUrl: require("@/assets/logo.png"),
        columns,
        oncePhoneTable,
        // 模态框状态
        oncephoneVisible: false,
        formData:{
            // id:'',
            // contactName:'',       // 
            phoneNumber:'',       // 电话
            // contactRelationship:'',    // 
            staffCode:'',    //员工编号
        },
        staffCode:'',     //输入框要查询的员工编号
        contactId:'',       // 要查询的银行卡号
        // 判断添加修改
        isAdd: true,
        // 验证规则(对应a-form-model上的rules)
        rules:{
            staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
            phoneNumber:[{validator: validatorMobile,trigger:"blur"}],
        }
    };
  },
  created() {
      this.getemergencyContencts()
  },
  methods:{
    // 点击表格某一行，拿到某一行的数据
    rowClick(record, index){
      return {
        
      }
    },
    // 曾用电话数据信息
    getemergencyContencts() {
        axios.get('/api/usedPhoneData').then(res=>{
            // console.log("data:",res);
            this.oncePhoneTable = res.data
            // console.log("this.bank:" , this.oncePhoneTable)
        })
    },
    // 添加紧急联系人
    addemergencyContact() {
        this.isAdd = true
        this.oncephoneVisible = true
        // // this.formData.id = ''
        // 点击添加紧急联系人清空表单数据
        this.formData.staffCode = ''
        this.formData.phoneNumber = ''
        // this.formData.contactPhone = ''
        // this.formData.contactRelationship =''
    },
    // 点击模态框确定按钮
    handleOk(formData) {
        this.oncephoneVisible = false
        // 如果点击添加按钮
        this.$refs[formData].validate(valid=>{
            if(valid) {
                console.log('ok');
                console.log(this.formData);
                if(this.isAdd) {
                    // 添加数据
                    axios.post('/api/addHistoryPhone',qs.stringify(this.formData)).then(res=>{
                        // console.log(res);
                        this.getemergencyContencts()
                    })
                } else {
                    axios.post('/api/upHistoryPhone',qs.stringify(this.formData)).then(res=>{
                    // console.log(res);
                        this.getemergencyContencts()
                    })
                }
            } else {
                this.oncephoneVisible = true
            }
        })
        
        
    },
    // 根据id获取紧急联系人信息
    contactIdSearch() {
        axios.post('/api/emergencyContenctById','id=' + this.contactId).then(res=>{
            // console.log(res.data);
        })
    },
    // 根据员工编号获取曾用电话信息
    oncePhoneSearch() {
        axios.post('/api/findPhones','staffCode='+ this.staffCode).then(res=>{
            console.log(res.data);
            if(res.status == 200) {
                this.oncePhoneTable = res.data
            }
        })
    },
    // 员工编号发生改变时
    staffChange() {
        if(this.staffCode == '') {
            this.getemergencyContencts()
        }
    },
    // 点击编辑按钮
    editor(e) {
        // console.log(e);
        this.oncephoneVisible = true
        this.isAdd = false
        this.formData.id = e.id
        this.formData.staffCode = e.staffCode
        this.formData.phoneNumber = e.phoneNumber
        // this.formData.contactPhone = e.contactPhone
        // this.formData.contactRelationship = e.contactRelationship
    }
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
i {
    font-style: normal;
}
.btn {
    height: 32px;
}
.btn .ant-btn {
    float: left;
    margin-bottom: 14px;
}
.btn .idSearch {
    float: left;
    margin-left: 20px;
}

</style>