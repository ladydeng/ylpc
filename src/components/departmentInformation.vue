<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addDeparInforTable" type="primary">添加部门基本信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的部门编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="departmentNameChange" v-model="departmentName" style="width: 240px" placeholder="请输入要查询的部门名称" enter-button @search="departmentNameSearch" />
                </div>
                <!-- <div class="idSearch"> -->
                <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                <!-- 更改日期：<a-date-picker @change="onEffectiveDate" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加出勤基本信息':'修改出勤基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "departmentId" required label="部门编号">
                            <a-input v-model="formData.departmentId" />
                        </a-form-model-item>
                        <a-form-model-item prop="departmentName" required label="部门名称">
                            <a-input v-model="formData.departmentName" />
                        </a-form-model-item>
                        <a-form-model-item prop= "dutyDescription" label="职责描述">
                            <a-input v-model="formData.dutyDescription" />
                        </a-form-model-item>    
                        <!-- <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeDate" required label="更改时间">
                            <a-input v-model="formData.changeDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeMultiple" required label="更改倍数">
                            <a-input v-model="formData.changeMultiple" />
                        </a-form-model-item> -->
                        <a-form-model-item prop="levelDivision" required label="级别划分">
                            <a-select v-model="formData.levelDivision" style="width: 275px" @change="handleChange">
                                <a-select-option value="1级">
                                    1级
                                </a-select-option>
                                <a-select-option value="2级">
                                    2级
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <!-- <a-form-model-item prop="originalAmount" required label="课程内容">
                            <a-input v-model="formData.originalAmount" />
                        </a-form-model-item> -->
                        <!-- <a-form-model-item prop="originalContent" required label="原始内容">
                            <a-input v-model="formData.originalContent" />
                        </a-form-model-item>
                        <a-form-model-item prop="originalMultiple" required label="原始倍数">
                            <a-input v-model="formData.originalMultiple" />
                        </a-form-model-item> -->
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="deparInforTable">
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
 * 2021年1月24日      qcc           v1.0.0              部门相关信息
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "部门编号", dataIndex: "departmentId", key: "departmentId" },
    { title: "部门名称", dataIndex: "departmentName", key: "departmentName" },
    { title: "职责描述", dataIndex: "dutyDescription", key: "dutyDescription" },
    { title: "级别划分", dataIndex: "levelDivision", key: "levelDivision" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var deparInforTable = [];

/**
 *
 * @Function: DepartmentInformation.vue
 * @Description: 部门信息
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
 * 2021年02月23日      qcc            v1.0.0             部门基本信息、更改注释信息
 * 
 */
export default {
    /**
   * name:组件名称
   */
    name: "DepartmentInformation",
    data() {
        return {
            //logog图片地址
            imgUrl: require("@/assets/logo.png"),
            columns,
            deparInforTable,     // 授课基本信息数组
            // 模态框状态
            performanceVisible: false,
            formData:{
                departmentId:'',      // 部门编号
                departmentName:'',    // 部门名称
                dutyDescription:'',   // 职责描述
                levelDivision:'',     // 级别划分
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                departmentId:[{ required: true, message: "部门编号不能为空", trigger: "blur" }],
                // changeDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                // effectiveDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                departmentName:[{ required: true, message: "部门名称不能为空", trigger: "blur" }],
                dutyDescription:[{ required: true, message: "职责描述不能为空", trigger: "blur" }],
                levelDivision:[{ required: true, message: "级别划分不能为空", trigger: "blur" }],
                // originalAmount:[{ required: true, message: "原始金额不能为空", trigger: "blur" }],
                // originalContent:[{ required: true, message: "原始内容不能为空", trigger: "blur" }],
                // originalMultiple:[{ required: true, message: "原始倍数不能为空", trigger: "blur" }],
                // value:[{ required: true, message: "字典内容不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            departmentName:'',     // 查询的部门名称
            // 判断添加修改
            isAdd: true
        };
    },
    created() {
        this.getAccountingContentDictionarys()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取绩效工资核算内容历史数据数据列表
        getAccountingContentDictionarys() {
            axios.get('http://192.168.90.204:7999/data-department/findDepartment').then(res=>{
                // console.log("data:",res);
                this.deparInforTable = res.data
                // console.log("this.bank:" , this.deparInforTable)
            })
        },
        // 点击按钮添加绩效工资内容词典
        addDeparInforTable() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.departmentId = '',
            this.formData.departmentName = '',
            this.formData.dutyDescription = '',
            this.formData.levelDivision = ''
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
                        axios.post('http://192.168.90.204:7999/data-department/addDepartment',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAccountingContentDictionarys()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-department/upDepartmentById',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAccountingContentDictionarys()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addDeparInforTable"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工id查询
        idSearch() {
            if(this.id == '') {
                alert('请输入要查询的用户id')
            } else {
                axios.post('http://192.168.90.204:7999/data-department/findDepartmentById','id='+this.id).then(res=>{
                    console.log(res);
                    if(res.status == 200) {
                        this.deparInforTable = [res.data]
                    }
                })
            }
            
        },
        // 根据员工编号查询
        onStaffCodeSearch() {
            if(this.staffCode == '') {
                alert('请输入要查询的部门编号')
            } else {
                axios.post('http://192.168.90.204:7999/data-department/findByDepartmentId','departmentId='+this.staffCode).then(res=>{
                    console.log(res);
                    if(res.status == 200) {
                        this.deparInforTable = [res.data]
                    }
                })
            }
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getAccountingContentDictionarys()
            }
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getAccountingContentDictionarys()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.formData.id = e.id
            this.formData.departmentId = e.departmentId,
            this.formData.departmentName = e.departmentName,
            this.formData.dutyDescription = e.dutyDescription,
            this.formData.levelDivision = e.levelDivision
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.204:7999/data-department/delDepartmentById','id='+e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getAccountingContentDictionarys()
                    }
                })
            } else {
                return;
            }
        },
        handleChange(value) {
            console.log(`selected ${value}`);
        },
        // 根据部门名称查询
        departmentNameSearch() {
            if(this.departmentName =='') {
                alert('请输入要查询的部门名称')
            } else {
                axios.post('http://192.168.90.204:7999/data-department/findByDepartmentName','departmentName=' + this.departmentName).then(res=>{
                    console.log(res);
                    this.deparInforTable = [res.data]
                })
            }
            
        },
        // 部门名称发生改变
        departmentNameChange() {
            if(this.departmentName == '') {
                this.getAccountingContentDictionarys()
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