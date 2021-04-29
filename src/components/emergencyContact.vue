<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加紧急联系人信息 -->
        <div>
            <div class="btn">
                <a-button @click="addemergencyContact" type="primary">添加紧急联系人信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <!-- <div class="idSearch">
                    <a-input-search @change="contactIdChange" v-model="contactId" style="width: 240px" placeholder="请输入您要查询的id" enter-button @search="contactIdSearch" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="contactVisible" :title="isAdd ? '添加紧急联系人信息':'修改紧急联系人信息'"  @ok="handleOk('formData')" >
                    <a-form-model :rules="rules" ref="formData" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd"  label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop= "contactName" required label="紧急联系人">
                            <a-input v-model="formData.contactName" />
                        </a-form-model-item>
                        <a-form-model-item prop="contactPhone" required label="电话">
                            <a-input v-model="formData.contactPhone" />
                        </a-form-model-item>
                        <a-form-model-item prop="contactRelationship" required label="关系">
                            <a-input v-model="formData.contactRelationship" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="contactTable">
            <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
            <template slot="operation" slot-scope="text,record">
                <i @click="editor(record)">编辑</i> | <i @click="del(record)">删除</i>
            </template>
        </a-table>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {validateMobile , validateIdCard} from "@/assets/js/vaildate.js";
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
  { title: "紧急联系人", dataIndex: "contactName", key: "contactName" },
  { title: "电话", dataIndex: "contactPhone", key: "contactPhone" },
  { title: "关系", dataIndex: "contactRelationship", key: "contactRelationship" },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var contactTable = [];

/**
 *
 * @Function: emergencyContact.vue
 * @Description: 紧急联系人
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
 * 2021年01月22日      qcc            v1.1.0            新建紧急联系人组件       
 * 2021年02月23日      qcc            v1.0.1            修改注释信息
 * 
 */
export default {
  /**
   * name:组件名称
   */
  name: "emergencyContact",
  data() {
    return {
        //logog图片地址
        imgUrl: require("@/assets/logo.png"),
        columns,
        contactTable,
        // 模态框状态
        contactVisible: false,
        formData:{
            // id:'',
            contactName:'',       // 紧急联系人
            contactPhone:'',       // 电话
            contactRelationship:'',    // 关系
            staffCode:'A0012',    //员工编号
        },
        staffCode:'',     //输入框要查询的员工编号
        contactId:'',       // 要查询的银行卡号
        // 判断添加修改
        isAdd: true,
        // 验证规则(对应a-form-model上的rules)
        rules:{
            contactName:[{ required: true, message: "紧急联系人姓名不能为空", trigger: "blur" },
            {min:2,max:5,message:'请输入2-5字符',trigger:'blur'}],
            staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
            contactRelationship:[{ required: true, message: "紧急联系人关系不能为空", trigger: "blur" }],
            contactPhone:[{validator: validatorMobile,trigger:"blur"}],
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
    // 紧急联系人数据信息
    getemergencyContencts() {
        axios.get('/api/emergencyContencts').then(res=>{
            // console.log("data:",res);
            this.contactTable = res.data
            // console.log("this.bank:" , this.contactTable)
        })
    },
    // 添加紧急联系人
    addemergencyContact() {
        this.isAdd = true
        this.contactVisible = true
        // this.formData.id = ''
        this.formData.staffCode = ''
        this.formData.contactName = ''
        this.formData.contactPhone = ''
        this.formData.contactRelationship =''
    },
    // 点击模态框确定按钮
    handleOk(formData) {
        this.contactVisible = false
        // 如果点击添加按钮
        this.$refs[formData].validate(valid=>{
            if(valid) {
                console.log('ok');
                console.log(this.formData);
                if(this.isAdd) {
                    axios.post('/api/addEmergencyContenct',qs.stringify(this.formData)).then(res=>{
                        // console.log(res);
                        this.getemergencyContencts()
                    })
                } else {
                    axios.post('/api/upEmergencyContenctById',qs.stringify(this.formData)).then(res=>{
                    // console.log(res);
                        this.getemergencyContencts()
                    })
                }
            } else {
                this.contactVisible = true
            }
        })
        
        
    },
    // 根据id获取紧急联系人信息
    contactIdSearch() {
        axios.post('/api/emergencyContenctById','id=' + this.contactId).then(res=>{
            // console.log(res.data);
        })
    },
    // 根据员工编号获取紧急联系人信息
    onStaffCodeSearch() {
        axios.post('/api/staffEmergencyContencts','staffCode='+ this.staffCode).then(res=>{
            console.log(res.data);
            if(res.status == 200) {
                this.contactTable = res.data
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
        this.contactVisible = true
        this.isAdd = false
        this.formData.id = e.id
        this.formData.staffCode = e.staffCode
        this.formData.contactName = e.contactName
        this.formData.contactPhone = e.contactPhone
        this.formData.contactRelationship = e.contactRelationship
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