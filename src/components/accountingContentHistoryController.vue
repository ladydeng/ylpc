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
                    <a-input-search @change="changeAmountChange" v-model="changeAmount" style="width: 240px" placeholder="请输入要查询的更改金额" enter-button @search="changeAmountSearch" />
                </div>
                <div class="idSearch">
                    <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                    更改日期：<a-date-picker @change="onEffectiveDate" />
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
                        <a-form-model-item prop="changeAmount" required label="更改金额">
                            <a-input v-model="formData.changeAmount" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop= "changeContent" label="更改内容">
                            <a-input v-model="formData.changeContent" />
                        </a-form-model-item>     -->
                        <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeDate" required label="更改时间">
                            <a-input v-model="formData.changeDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeMultiple" required label="更改倍数">
                            <a-input v-model="formData.changeMultiple" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeType"  required label="更改类型">
                            <a-select v-model="formData.changeType" style="width: 275px" @change="handleChange">
                                <a-select-option value="新增">
                                    新增
                                </a-select-option>
                                <a-select-option value="更新">
                                    更新
                                </a-select-option>
                                <a-select-option value="删除">
                                    删除
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="originalAmount" required label="原始金额">
                            <a-input v-model="formData.originalAmount" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop="originalContent" required label="原始内容">
                            <a-input v-model="formData.originalContent" />
                        </a-form-model-item> -->
                        <a-form-model-item prop="changeContent" required label="更改内容">
                            <!-- <a-input v-model="formData.changeContent" /> -->
                            <a-select v-model="formData.changeContent" style="width: 275px">
                                <a-select-option  v-for="(item,index) in contentValue" :key="index" :value="item.value">
                                  {{item.value}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="originalContent" required label="原始内容">
                            <!-- <a-input v-model="formData.originalContent" /> -->
                            <a-select v-model="formData.originalContent" style="width: 275px">
                                <a-select-option  v-for="(item,index) in contentValue" :key="index" :value="item.value">
                                  {{item.value}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="originalMultiple" required label="原始倍数">
                            <a-input v-model="formData.originalMultiple" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="accountingTable">
            <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
            <template slot="operation" slot-scope="text,record">
                <i @click="editor(record)">编辑</i> | <i @click="del(record)">删除</i>
            </template>
        </a-table>
    </div>
</template>

<script>
import axios from "axios";
/* 本页属性 表格列头*/
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
    { title: "更改金额", dataIndex: "changeAmount", key: "changeAmount" },
    { title: "生效日期", dataIndex: "effectiveDate", key: "effectiveDate" },
    { title: "更改时间", dataIndex: "changeDate", key: "changeDate" },
    { title: "更改内容", dataIndex: "changeContent", key: "changeContent" },
    { title: "更改倍数", dataIndex: "changeMultiple", key: "changeMultiple" },
    { title: "原始金额", dataIndex: "originalAmount", key: "originalAmount" },
    { title: "更改类型", dataIndex: "changeType", key: "changeType" },
    { title: "原始内容", dataIndex: "originalContent", key: "originalContent" },
    { title: "原始倍数", dataIndex: "originalMultiple", key: "originalMultiple" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var accountingTable = [];

/**
 *
 * @Function: accountingContentHistoryCotroller.vue
 * @Description: 绩效工资核算历史信息
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
 * 2021年02月20日      qcc            v1.0.0            绩效工资核算信息、添加/修改/删除绩效历史工资核算信息
 * 2021年02月23日      qcc            v1.0.1            修改注释信息
 * 
 * 
 */
export default {
    /**
   * name:组件名称
   */
    name: "accountingContentHistoryCotroller",
    data() {
        return {
            //logog图片地址
            imgUrl: require("@/assets/logo.png"),
            columns,
            accountingTable,
            // 模态框状态
            performanceVisible: false,
            formData:{
                changeAmount:'',     // 更改金额
                changeDate:'',    //更改时间
                effectiveDate:'',   // 生效日期
                changeContent:'',   // 更改内容
                changeMultiple:'',   // 更改倍数
                staffCode:'',
                changeType:'',     //更改类型：更新、删除、新增
                originalAmount:'',     // 原始金额
                originalContent:'',      // 原始内容
                originalMultiple:'',      // 原始倍数
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                changeAmount:[{ required: true, message: "更改不能为空", trigger: "blur" }],
                changeDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                effectiveDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                changeContent:[{ required: true, message: "更改内容不能为空", trigger: "blur" }],
                changeMultiple:[{ required: true, message: "更改倍数不能为空", trigger: "blur" }],
                changeType:[{ required: true, message: "更改类型不能为空", trigger: "blur" }],
                originalAmount:[{ required: true, message: "原始金额不能为空", trigger: "blur" }],
                originalContent:[{ required: true, message: "原始内容不能为空", trigger: "blur" }],
                originalMultiple:[{ required: true, message: "原始倍数不能为空", trigger: "blur" }],
                staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            changeAmount:'',     // 查询的更改额度
            // 判断添加修改
            isAdd: true,
            contentValue:[]
        };
    },
    created() {
        this.getAccountingContentHistorysData()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取绩效工资核算内容历史数据数据列表
        getAccountingContentHistorysData() {
            axios.get('/api/accountingContentHistorys').then(res=>{
                console.log("data:",res);
                this.accountingTable = res.data
                // console.log("this.bank:" , this.accountingTable)
            })
        },
        // 点击按钮添加绩效工资核算信息
        addPerformance() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.staffCode = '',
            this.formData.changeAmount = '',    //更改金额
            this.formData.changeContent = '',   // 更改内容
            this.formData.changeDate = ''   // 更改时间
            this.formData.changeMultiple = ''   // 更改倍数
            this.formData.changeType = ''   // 更改类型
            this.formData.effectiveDate = ''   // 生效日期
            this.formData.originalAmount = ''   // 原始金额
            this.formData.originalContent = ''   // 原始内容
            this.formData.originalMultiple = ''   // 原始倍数
            this.getDictionarys()
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
                        axios.post('/api/addAccountingContentHistory',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAccountingContentHistorysData()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('/api/upAccountingContentHistory',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAccountingContentHistorysData()
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
        // 根据员工编号查找绩效工资核算历史信息
        onStaffCodeSearch() {
            axios.post('/api/accountingContentHistoryByStaffCode','staffCode='+this.staffCode).then(res=>{
                if(this.staffCode == '') {
                    alert('请输入员工编号')
                } else if(res.status == 200) {
                    console.log(res);
                    this.accountingTable = res.data
                }
            })
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getAccountingContentHistorysData()
            }
        },
        // 根据员工id获取绩效工资核算历史信息
        idSearch() {
            axios.post('/api/accountingContentHistoryById','id='+this.id).then(res=>{
                console.log(res);
                if(this.id == '') {
                    alert('请输入要查询的用户id')
                } else if(res.status == 200) {
                    this.accountingTable = [res.data]
                }
            })
        },
        // 生效日期发生改变
        onEffectiveDate(date,dateString) {
            if(dateString!=='') {
                axios.post('/api/accountingContentHistoryByChangeDate','changeDate=' + dateString).then(res=>{
                    // console.log(res);
                    this.accountingTable = res.data
                })
            } else {
                this.getAccountingContentHistorysData()
            }
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getAccountingContentHistorysData()
            }
        },
        // 根据更改额度查找绩效工资核算历史记录
        changeAmountSearch() {
            axios.post('/api/accountingContentHistoryByChangeAmount','changeAmount='+this.changeAmount).then(res=>{
                // console.log(res);
                if(this.changeAmount == '') {
                    alert('请输入要查询工资比例')
                } else if(res.status == 200) {
                    this.accountingTable = res.data
                }
            })
        },
        // 工资比例的输入框发生变化
        changeAmountChange() {
            if(this.changeAmount == '') {
                this.getAccountingContentHistorysData()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.formData.id = e.id
            this.formData.staffCode = e.staffCode,
            this.formData.changeAmount = e.changeAmount,    //更改金额
            this.formData.changeContent = e.changeContent,   // 更改内容
            this.formData.changeDate = e.changeDate   // 更改时间
            this.formData.changeMultiple = e.changeMultiple   // 更改倍数
            this.formData.changeType = e.changeType   // 更改类型
            this.formData.effectiveDate = e.effectiveDate   // 生效日期
            this.formData.originalAmount = e.originalAmount   // 原始金额
            this.formData.originalContent = e.originalContent   // 原始内容
            this.formData.originalMultiple = e.originalMultiple   // 原始倍数
            this.getDictionarys()

        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('/api/removeAccountingContentHistory','id='+e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getAccountingContentHistorysData()
                    }
                })
            } else {
                return;
            }
        },
        handleChange(value) {
            console.log(`selected ${value}`);
        },
        // 获取字典内容
        getDictionarys() {
            axios.get('/api/accountingContentDictionarys').then(res=>{
                console.log(res.data);
                this.contentValue = res.data
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