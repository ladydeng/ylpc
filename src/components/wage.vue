<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addWage" type="primary">添加工资基本信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="wageBaseChange" v-model="wageBase" style="width: 240px" placeholder="请输入发放比例" enter-button @search="wageBaseSearch" />
                </div>
            </div>
            <!-- 模态框 -->
            <a-modal v-model="wageVisible" title="添加层用卡信息" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop= "salaryAmount" required label="工资金额">
                            <a-input v-model="formData.salaryAmount" />
                        </a-form-model-item>
                        <a-form-model-item prop="socialSecurityWithholding" required label="社保企业代扣金额">
                            <a-input v-model="formData.socialSecurityWithholding" />
                        </a-form-model-item>
                        <a-form-model-item prop="wageBase" required label="工资发放基数">
                            <a-input v-model="formData.wageBase" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="wageTable">
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
import {validatebankCard} from "@/assets/js/vaildate.js";
// 银行卡验证规则
var validatorbankCard = (rule,value,callback) =>{
    if(!value) {
        return callback(new Error('银行卡号不能为空'))
    } else {
        if(validatebankCard(value)) {
        callback()
        } else {
        return callback(new Error('银行卡号格式不正确'))
        }
    }
};
const columns = [
//   { title: "ID", dataIndex: "id", key: "id" },
    { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
    { title: "工资金额", dataIndex: "salaryAmount", key: "salaryAmount" },
    { title: "工资发放基数", dataIndex: "wageBase", key: "wageBase" },
    { title: "社保企业代扣金额", dataIndex: "socialSecurityWithholding", key: "socialSecurityWithholding " },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var wageTable = [];

/**
 *
 * @Function: usedBankCards.vue
 * @Description: 人员曾用银行卡信息
 *
 * @return：name,data(),created()
 * @throws：异常描述
 *
 * @version: v1.0.0
 * @author: qcc
 * @date: 2021年01月22日 上午10:28:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2021年01月27日      qcc            v1.0.0            新建工资信息组件
 * 2021年01月28日      qcc            v1.0.1            工资信息/添加修改查询工资基本信息
 * 
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
            wageTable,
            // 模态框状态
            wageVisible: false,
            formData:{
                salaryAmount:'',     // 工资金额
                socialSecurityWithholding :'',    //社保企业代扣金额
                staffCode:'',
                wageBase:'',        // 工资发放基数不能为空
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                salaryAmount:[{ required: true, message: "工资金额不能为空", trigger: "blur" }],
                socialSecurityWithholding:[{ required: true, message: "社保代扣金额不能为空", trigger: "blur" }],
                wageBase :[{ required: true, message: "工资发放基数不能为空", trigger: "blur" }],
                staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            wageBase:'',     // 查询的发放比例
            // 判断添加修改
            isAdd: true
        };
    },
    created() {
        this.getSalaryData()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 工资基本信息
        getSalaryData() {
            axios.get('/api/salaryData').then(res=>{
                // console.log("data:",res);
                this.wageTable = res.data
                // console.log("this.bank:" , this.wageTable)
            })
        },
        // 添加员工工资信息
        addWage() {
            this.isAdd = true
            this.wageVisible = true
            this.formData.salaryAmount = '',
            this.formData.staffCode = '',
            this.formData.socialSecurityWithholding = '',
            this.formData.wageBase = ''
        },
        // 点击模态框确定按钮
        handleOk() {
            // 判断验证是否通过
            this.$refs['formData'].validate(valid=>{
                if(!valid) {
                    this.wageVisible = true
                    return
                } else {
                    if(this.isAdd) {
                        // 获取添加信息
                        axios.post('/api/addSalary',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.wageVisible = false
                                // 重新获取数据
                                this.getSalaryData()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('/api/upSalary',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.wageVisible = false
                                // 重新获取数据
                                this.getSalaryData()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addWage"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工编号查找工资信息信息
        onStaffCodeSearch() {
            axios.post('/api/salaryDataByStaffCode','staffCode='+this.staffCode).then(res=>{
                if(this.staffCode == '') {
                    alert('请输入员工编号')
                } else if(res.status == 200) {
                    console.log(res);
                    this.wageTable = [res.data]
                }
            })
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
            this.getSalaryData()
            }
        },
        // 根据员工id获取员工工资信息
        idSearch() {
            axios.post('/api/salaryDataById','id='+this.id).then(res=>{
                // console.log(res);
                if(this.id == '') {
                    alert('请输入要查询的用户id')
                } else if(res.status == 200) {
                    this.wageTable = [res.data]
                }
            })
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getSalaryData()
            }
        },
        // 根据发放比例获取员工工资
        wageBaseSearch() {
            axios.post('/api/salaryDataByWage','wageBase='+this.wageBase).then(res=>{
                // console.log(res);
                if(this.wageBase == '') {
                    alert('请输入要查询工资比例')
                } else if(res.status == 200) {
                    this.wageTable = res.data
                }
            })
        },
        // 工资比例的输入框发生变化
        wageBaseChange() {
            if(this.wageBase == '') {
                this.getSalaryData()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.wageVisible = true
            this.formData.id = e.id
            this.formData.staffCode = e.staffCode,
            this.formData.salaryAmount = e.salaryAmount,
            this.formData.socialSecurityWithholding = e.socialSecurityWithholding
            this.formData.wageBase = e.wageBase
        },
        // 删除数据
        del(e) {
            // console.log(e);
            // if(confirm('确认删除吗？')) {
            //     axios.post('/api/removeUsedBankCardById','id='+e.id).then(res=>{
            //         console.log(res);
            //         if(res.status ==200) {
            //             this.getSalaryData()
            //         }
            //     })
            // } else {
            //     return;
            // }
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