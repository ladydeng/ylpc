<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addPerformance" type="primary">添加绩效工资核算信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="performanceChange" v-model="performance" style="width: 240px" placeholder="请输入要查询的绩效内容" enter-button @search="performanceSearch" />
                </div>
                <div class="idSearch">
                    <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                    生效日期：<a-date-picker @change="onEffectiveDate" />
                </div>
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加绩效工资核算内容':'修改绩效工资核算内容'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop="contentQuota" required label="内容配额">
                            <a-input v-model="formData.contentQuota" />
                        </a-form-model-item>
                        <a-form-model-item prop= "contentNumber" label="内容配额倍数">
                            <a-input v-model="formData.contentNumber" />
                        </a-form-model-item>
                        
                        <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="performanceContent" required label="考核内容">
                            <!-- <a-input v-model="formData.performanceContent" /> -->
                            <a-select v-model="formData.performanceContent" style="width: 275px">
                                <a-select-option  v-for="(item,index) in contentValue" :key="index" :value="item.value">
                                  {{item.value}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="performanceTable">
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
import {validateDate} from "@/assets/js/vaildate.js";
// 日期验证规则
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
    { title: "内容配额", dataIndex: "contentQuota", key: "contentQuota" },
    { title: "生效日期", dataIndex: "effectiveDate", key: "effectiveDate" },
    { title: "考核内容", dataIndex: "performanceContent", key: "performanceContent" },
    { title: "内容配额倍数", dataIndex: "contentNumber", key: "contentNumber" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var performanceTable = [];

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
 * 2021年02月20日      qcc            v1.0.0            绩效工资核算信息
 * 2021年02月22日      qcc            v1.0.0            添加信息更改绩效内容
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
            performanceTable,
            // 模态框状态
            performanceVisible: false,
            formData:{
                performanceContent :'',     // 考核内容
                effectiveDate :'',    //生效日期
                staffCode:'',
                contentQuota:'',        // 内容配额
                contentNumber:'1',       // 内容配额倍数
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                performanceContent :[{ required: true, message: "考核内容不能为空", trigger: "blur" }],
                effectiveDate:[{validator: validatorDate,trigger:"blur"}],
                contentQuota :[{ required: true, message: "内容配额不能为空", trigger: "blur" }],
                staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            performance:'',     // 查询的绩效内容
            // 判断添加修改
            isAdd: true,
            contentValue:[]    // 绩效字典列表
        };
    },
    created() {
        this.getPerformanceData()
        
        
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 绩效工资核算内容
        getPerformanceData() {
            axios.get('/api/accountingContentSalarys').then(res=>{
                // console.log("data:",res);
                this.performanceTable = res.data
                // console.log("this.bank:" , this.performanceTable)
            })
        },
        // 点击按钮添加绩效工资核算信息
        addPerformance() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.performanceContent = '',
            this.formData.staffCode = '',
            this.formData.effectiveDate = '',
            this.formData.contentQuota = '',
            this.formData.contentNumber = '1'
            this.getDictionarys()
        },
        // 获取字典内容
        getDictionarys() {
            axios.get('/api/accountingContentDictionarys').then(res=>{
                console.log(res.data);
                this.contentValue = res.data
            })
        },
        // 点击模态框确定按钮
        handleOk() {
            // 判断验证是否通过
            this.$refs['formData'].validate(valid=>{
                if(!valid) {
                    this.performanceVisible = true
                    return
                } else {
                    if(this.isAdd) {
                        // 添加绩效工资核算
                        axios.post('/api/addAccountingContentSalary',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getPerformanceData()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('/api/upAccountingContentSalary',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getPerformanceData()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addPerformance"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工编号查找绩效工资核算信息
        onStaffCodeSearch() {
            axios.post('/api/accountingContentSalaryByStaffCode','staffCode='+this.staffCode).then(res=>{
                if(this.staffCode == '') {
                    alert('请输入员工编号')
                } else if(res.status == 200) {
                    console.log(res);
                    this.performanceTable = res.data
                }
            })
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getPerformanceData()
            }
        },
        // 根据员工id获取绩效工资核算信息
        idSearch() {
            axios.post('/api/accountingContentSalaryById','id='+this.id).then(res=>{
                console.log(res);
                if(this.id == '') {
                    alert('请输入要查询的用户id')
                } else if(res.status == 200) {
                    this.performanceTable = [res.data]
                }
            })
        },
        // 生效日期发生改变
        onEffectiveDate(date,dateString) {
            if(dateString!=='') {
                axios.post('/api/accountingContentSalaryByEffectiveDate','effectiveDate=' + dateString).then(res=>{
                    // console.log(res);
                    this.performanceTable = res.data
                })
            } else {
                this.getPerformanceData()
            }
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getPerformanceData()
            }
        },
        // 根据绩效内容查找绩效工资核算
        performanceSearch() {
            axios.post('/api/accountingContentSalaryByPerformanceContent','performanceContent='+this.performance).then(res=>{
                // console.log(res);
                if(this.performance == '') {
                    alert('请输入要查询工资比例')
                } else if(res.status == 200) {
                    this.performanceTable = res.data
                }
            })
        },
        // 工资比例的输入框发生变化
        performanceChange() {
            if(this.performance == '') {
                this.getPerformanceData()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.formData.id = e.id
            this.formData.staffCode = e.staffCode,
            this.formData.performanceContent = e.performanceContent,    //考核内容
            this.formData.effectiveDate = e.effectiveDate,   // 生效日期
            this.formData.contentQuota = e.contentQuota   // 内容配额
            this.formData.contentNumber = e.contentNumber   // 内容配额倍数
            this.getDictionarys()
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('/api/deleteAccountingContentSalary','id='+e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getPerformanceData()
                    }
                })
            } else {
                return;
            }
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