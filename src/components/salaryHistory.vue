<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addWage" type="primary">添加工资基本信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 200px" placeholder="请输入您要查询的id" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="staffCodeChange" v-model="staffCode" style="width: 200px" placeholder="请输入您要查询的编号" enter-button @search="staffCodeSearch" />
                </div>
                <div class="idSearch">
                    <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                    更改日期：<a-date-picker @change="onDataSearch" />
                </div>
                
                <div class="idSearch">
                    <!-- <a-input-search @change="messageChange" v-model="wageBase" style="width: 240px" placeholder="请输入发放比例" enter-button @search="wageBaseSearch" /> -->
                    <!-- 根据生效时间查询 -->
                    生效日期：<a-date-picker @change="effectiveDateSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="messageChange" v-model="message" style="width: 240px" placeholder="记录信息" enter-button @search="messageSearch" />
                    <!-- 根据生效时间查询 -->
                    <!-- 生效日期：<a-date-picker @change="effectiveDateSearch" /> -->
                </div>
                <div class="idSearch">
                    <!-- <a-input @change="idChange" v-model="id" style="width: 200px" placeholder="请输入您要查询较早日期" /> --
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询较晚日期" enter-button @search="idSearch" /> -->
                    查询区间：<a-range-picker @change="onChange" />
                </div>
            </div>
            <!-- 模态框 -->
            <a-modal v-model="wageVisible" :title="isAdd ? '添加员工历史工资信息':'修改员工历史工资信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item  prop= "staffCode" required label="员工编号">
                            <a-input :style="{disabled:isAdd?'':'disabled'}" v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop= "message" required label="变更信息">
                            <a-input v-model="formData.message" />
                        </a-form-model-item>
                        <a-form-model-item prop="operationCategory" required label="操作类别">
                            <a-select v-model="formData.operationCategory" placeholder="please select your zone">
                                <a-select-option value="提升">提升</a-select-option>
                                <a-select-option value="下降">下降</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="oldQuota" required label="更改前额度">
                            <a-input v-model="formData.oldQuota" />
                        </a-form-model-item>
                        <a-form-model-item prop="newQuota" required label="更改后额度">
                            <a-input v-model="formData.newQuota" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeDate" required label="更改日期">
                            <a-input v-model="formData.changeDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="salaryHistoryTable">
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
 * 2021年1月21日      qcc           v1.0.0              新建页面、
 * 2021年2月20日      qcc           v1.0.1              根据更新时间查找基本工资历史信息
 * /
import axios from "axios";
/* 本页属性 表格列头*/
import axios from 'axios'
import qs from 'qs'
import {validateDate} from "@/assets/js/vaildate.js";
// 银行卡验证规则
var validatorDate = (rule,value,callback) =>{
    if(!value) {
        return callback(new Error('日期不能为空'))
    } else {
        if(validateDate(value)) {
        callback()
        } else {
        return callback(new Error('日期格式必须是YYYY-MM-DD'))
        }
    }
};
const columns = [
//   { title: "ID", dataIndex: "id", key: "id" },
    { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
    { title: "更改内容", dataIndex: "message", key: "message" },
    { title: "操作类别", dataIndex: "operationCategory", key: "operationCategory" },
    { title: "更改前额度", dataIndex: "oldQuota", key: "oldQuota" },
    { title: "更改后额度", dataIndex: "newQuota", key: "newQuota" },
    { title: "更改日期", dataIndex: "changeDate", key: "changeDate" },
    { title: "生效日期", dataIndex: "effectiveDate", key: "effectiveDate" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var salaryHistoryTable = [];


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
 * 2021年01月29日      qcc            v1.0.0            新建历史工资组件/添加，修改查询
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
            salaryHistoryTable,
            // 模态框状态
            wageVisible: false,
            formData:{
                changeDate:'',     // 更改日期
                effectiveDate:'',    //生效日期
                staffCode:'',
                message:'',         // 更改内容信息
                newQuota:'',        // 更改后额度
                oldQuota:'',        // 更改前额度
                operationCategory:'',     // 操作类别（提升/下降）
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                changeDate:[{validator: validatorDate,trigger:"blur"}],
                effectiveDate:[{validator: validatorDate,trigger:"blur"}],
                message:[{ required: true, message: "更改信息不能为空", trigger: "blur" }],
                staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
                newQuota:[{ required: true, message: "更改后额度不能为空", trigger: "blur" }],
                oldQuota:[{ required: true, message: "更改前额度不能为空", trigger: "blur" }],
                operationCategory:[{ required: true, message: "操作类别不能为空", trigger: "blur" }],
            },
            message:'',     // 查询记录信息
            id:'',       // 要查询的id
            staffCode:'',  // 员工编号
            wageBase:'',     // 查询的发放比例
            // 判断添加修改
            isAdd: true
        };
    },
    created() {
        this.getDataSalaryHistorys()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 所有的基本工资历史记录
        getDataSalaryHistorys() {
            axios.get('/api/dataSalaryHistorys').then(res=>{
                // console.log("data:",res);
                this.salaryHistoryTable = res.data
                // console.log("this.bank:" , this.salaryHistoryTable)
            })
        },
        // 添加员工工资信息
        addWage() {
            this.isAdd = true
            this.wageVisible = true
            this.formData.id = ''
            this.formData.staffCode = '',
            this.formData.message = '',
            this.formData.newQuota = '',
            this.formData.oldQuota = '',
            this.formData.operationCategory = '',
            this.formData.changeDate = '',
            this.formData.effectiveDate = ''
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
                        axios.post('/api/addSalaryHistory',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log(res);
                                this.wageVisible = false
                                // 重新获取数据
                                this.getDataSalaryHistorys()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('/api/upSalaryHistory',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.wageVisible = false
                                // 重新获取数据
                                this.getDataSalaryHistorys()
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
        // 根据更新时间查询工资历史信息
        onDataSearch(date,dateString) {
            axios.post('/api/dataSalaryHistoryByChangeDate','changeDate='+ dateString).then(res=>{
                if(res.status == 200) {
                    // console.log(res);
                    this.salaryHistoryTable = res.data
                }
            })
        },
        // 输入框更新日期发生改变时
        DataChange() {
            if(this.changeData == '') {
                this.getDataSalaryHistorys()
            }
        },
        // 根据生效时间查询
        effectiveDateSearch(date, dateString) {
            axios.post('/api/dataSalaryHistoryByEffectiveDate','effectiveDate='+ dateString).then(res=>{
                if(res.status == 200) {
                    // console.log(res);
                    this.salaryHistoryTable = res.data
                }
            })
        },
        // 根据员工id获取历史工资信息
        idSearch() {
            axios.post('/api/dataSalaryHistorysById','id='+this.id).then(res=>{
                // console.log(res);
                if(this.id == '') {
                    alert('请输入要查询的用户id')
                } else if(res.status == 200) {
                    this.salaryHistoryTable = res.data
                }
            })
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getDataSalaryHistorys()
            }
        },
        // 根据员工编号获取
        staffCodeSearch() {
            console.log(11);
            axios.post('/api/dataSalaryHistorysByStaffCode','staffCode='+this.staffCode ).then(res=>{
                console.log(res);
                if(this.staffCode == '') {
                    alert('请输入要查询的用户编号')
                } else if(res.status == 200) {
                    this.salaryHistoryTable = res.data
                }
            })
        },
        // 员工编号发生改变
        staffCodeChange() {
            if(this.staffCode == '') {
                this.getDataSalaryHistorys()
            }
        },
        // 根据记录信息查找工资历史信息
        messageSearch() {
            axios.post('/api/dataSalaryHistoryByMessage','message='+ this.message).then(res=>{
                // console.log(res);
                if(this.message == '') {
                    alert('请输入要查询的信息')
                } else if(res.status == 200) {
                    this.salaryHistoryTable = res.data
                }
            })
        },
        // 信息记录发生改变
        messageChange() {
            if(this.message == '') {
                this.getDataSalaryHistorys()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.wageVisible = true
            this.formData.id = e.id
            this.formData.staffCode = e.staffCode,
            this.formData.message = e.message,
            this.formData.newQuota = e.newQuota
            this.formData.oldQuota = e.oldQuota
            this.formData.operationCategory = e.operationCategory
            this.formData.changeDate = e.changeDate
            this.formData.effectiveDate = e.effectiveDate
        },
        // 删除数据
        del(e) {
            // console.log(e);
            // if(confirm('确认删除吗？')) {
            //     axios.post('/api/removeUsedBankCardById','id='+e.id).then(res=>{
            //         console.log(res);
            //         if(res.status ==200) {
            //             this.getDataSalaryHistorys()
            //         }
            //     })
            // } else {
            //     return;
            // }
        },
        // 选择最早和最晚日期
        onChange(date, dateString) {
            // console.log(date, dateString);
            console.log(dateString);
            axios.post('/api/dataSalaryHistoryByChangeDateBetweenOn','earlyDate='+dateString[0]+'&lateData='+dateString[1]).then(res=>{
                // console.log(res);
                if(dateString[0]!='' && dateString[1]!='') {
                    if(res.status == 200) {
                        this.salaryHistoryTable = res.data
                    }
                } else {
                    this.getDataSalaryHistorys()
                }
                
            })
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
i {
    font-style: normal;
}
.btn {
    height: 64px;
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