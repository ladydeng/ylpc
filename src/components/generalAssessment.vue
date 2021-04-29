<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加通用考核基本信息 -->
        <div>
            <div class="btn">
                <a-button @click="addgeneralAssessmentTable" type="primary">添加通用考核基本信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的岗位编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="staffNameChange" v-model="staffName" style="width: 240px" placeholder="请输入您要查询用户姓名" enter-button @search="staffNameSearch" />
                </div>
                <!-- <div class="idSearch">
                    <a-input-search @change="departmentNameChange" v-model="departmentName" style="width: 240px" placeholder="请输入要查询的部门名称" enter-button @search="departmentNameSearch" />
                </div> -->
                <!-- <div class="idSearch"> -->
                <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                <!-- 更改日期：<a-date-picker @change="onEffectiveDate" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="generalAssessmentVisible" :title="isAdd ? '添加岗位基本信息':'修改岗位基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop="month" required label="月份">
                            <a-select v-model="formData.month" style="width: 275px" @change="handleChange">
                                <a-select-option v-for="(item,index) in monthArr" :value="item" :key="index">{{item}}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>   
                        <a-form-model-item prop="staffName" required label="员工姓名">
                            <a-input v-model="formData.staffName" />
                        </a-form-model-item>
                        <a-form-model-item prop="attendanceDetails" required label="出勤详情">
                            <a-input v-model="formData.attendanceDetails" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :pagination="pageination1" :rowKey="record=>record.id" :columns="columns" :data-source="generalAssessmentTable">
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
 * @templateName: generalAssessment.vue
 * @Description: 通用考核基本信息
 * 
 *
 * @version: v1.1.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年03月05日      qcc           v1.0.0              通用考核基本信息
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
    { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
    { title: "员工姓名", dataIndex: "staffName", key: "staffName" },
    { title: "出勤详情", dataIndex: "attendanceDetails", key: "attendanceDetails" },
    { title: "时间月份", dataIndex: "month", key: "month" },
    
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var generalAssessmentTable = [];

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
 * 2021年02月23日      qcc            v1.0.0             添加通用考核基本信息
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
            generalAssessmentTable,     // 授课基本信息数组
            // 模态框状态
            generalAssessmentVisible: false,
            formData:{
                staffCode:'',      // 员工编号
                staffName:'',    // 员工姓名
                attendanceDetails:'',   // 出勤详情
                month:'',   // 时间月份
            },
            monthArr:[1,2,3,4,5,6,7,8,9,10,11,12],
            // 验证规则(对应a-form-model上的rules)
            rules:{
                staffCode:[{ required: true, message: "所属部门不能为空", trigger: "blur" }],
                // changeDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                // effectiveDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                staffName:[{ required: true, message: "岗位编号不能为空", trigger: "blur" }],
                attendanceDetails:[{ required: true, message: "岗位名称不能为空", trigger: "blur" }],
                month:[{ required: true, message: "级别划分不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            staffName:'',     // 查询的部门名称
            // 判断添加修改
            isAdd: true,
            pageination1:{
                current: 1,      // 当前页数
                pageSize: 2,     // 每页显示
                pageSizeOptions:['10','20','30'],
                showTotal:(total,range)=>{
                    return  '共' + total + '条'
                },
                showQuickJumper:true,
                showSizeChanger: true,
                total: 0,
                onShowSizeChange:(current, pageSize)=>{
                    // console.log(current,pageSize);
                    this.pageination1.pageSize = pageSize
                    this.getTotal()
                    this.getGeneralAssements()
                },
                onChange:(current,size)=>{
                    // console.log(current,size);
                    this.pageination1.current = current;
                    this.pageination1.pageSize = size;
                    this.getTotal()
                    this.getGeneralAssements()
                }
            },
        };
    },
    created() {
        this.getTotal()
        this.getGeneralAssements()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取通用考核基本信息列表
        getGeneralAssements() {
            axios.get('http://192.168.90.204:7999/data-general/findAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                // console.log("data:",res);
                this.generalAssessmentTable = res.data
                // console.log("this.bank:" , this.generalAssessmentTable)
            })
        },
        // 点击按钮添加岗位基本信息列表
        addgeneralAssessmentTable() {
            this.isAdd = true
            this.generalAssessmentVisible = true
            this.formData.staffCode = '',
            this.formData.staffName = '',
            this.formData.attendanceDetails = ''
            this.formData.month = ''
        },
        // 点击模态框确定按钮
        handleOk() {
            // 判断验证是否通过
            this.$refs['formData'].validate(valid=>{
                if(!valid) {
                    this.generalAssessmentVisible = true
                    return
                } else {
                    if(this.isAdd) {
                        // 添加绩效工资核算
                        axios.post('http://192.168.90.204:7999/data-general/addGeneral',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log(res);
                                this.generalAssessmentVisible = false
                                // 重新获取数据
                                this.getTotal()
                                this.getGeneralAssements()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-general/updateGeneral',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.generalAssessmentVisible = false
                                // 重新获取数据
                                this.getGeneralAssements()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addgeneralAssessmentTable"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工编号查询
        onStaffCodeSearch() {
            if(this.staffCode == '') {
                alert('请输入要查询的部门编号')
            } else {
                // console.log(11);
                axios.post('http://192.168.90.204:7999/data-general/findByStaffCode','staffCode='+ this.staffCode).then(res=>{
                    console.log(res);
                    if(res.status == 200) {
                        if(res.data == '') {
                            this.generalAssessmentTable = []
                            
                        } else {
                            this.generalAssessmentTable = [res.data]
                        }
                    }
                })
            }
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getTotal()
                this.getGeneralAssements()
            }
        },
        // 根据员工姓名查询
        staffNameSearch() {
            if(this.staffName == '') {
                alert('请输入要查询的员工姓名')
            } else {
                // console.log(11);
                axios.post('http://192.168.90.204:7999/data-general/findByStaffName','staffName='+ this.staffName).then(res=>{
                    console.log(res);
                    if(res.status == 200) {
                        if(res.data == '') {
                            this.generalAssessmentTable = []
                            
                        } else {
                            this.generalAssessmentTable = res.data
                        }
                    }
                })
            }
        },
        // 员工姓名发生改变
        staffNameChange() {
            if(this.staffName == '') {
                this.getTotal()
                this.getGeneralAssements()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.generalAssessmentVisible = true
            this.formData.id = e.id
            // console.log(e.department);
            this.formData.staffCode = e.staffCode,
            this.formData.staffName = e.staffName,
            this.formData.attendanceDetails = e.attendanceDetails
            this.formData.month = e.month
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.204:7999/data-general/deleteGeneral','id='+e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getTotal()
                        this.getGeneralAssements()
                    }
                })
            } else {
                return;
            }
        },
        handleChange(value) {
            console.log(`selected ${value}`);
        },
        // 总条数
        getTotal() {
            axios.post('http://192.168.90.204:7999/data-general/findAllTotal').then(res=>{
                console.log(res.data);
                this.pageination1.total = res.data
            })
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