<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加考核项目列表 -->
        <div>
            <div class="btn">
                <a-button @click="addassessProjectTable" type="primary">添加考核基本列表</a-button>
                <!-- <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的部门编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="departmentNameChange" v-model="departmentName" style="width: 240px" placeholder="请输入要查询的部门名称" enter-button @search="departmentNameSearch" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加出勤基本信息':'修改出勤基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="项目数据编号">
                            <a-input disabled v-model="formData.projectId" />
                        </a-form-model-item>
                        <a-form-model-item prop= "assessProject" required label="考核项目">
                            <a-input v-model="formData.assessProject" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table @click="handleTableChange2" :pagination="pageination1" :rowKey="record=>record.id" :columns="columns" :data-source="assessProjectTable">
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
 * 2021年03月01日      qcc           v1.0.0              考核项目列表接口对接
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
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "项目数据编号", dataIndex: "projectId", key: "projectId",align: 'center'},
    { title: "考核项目", dataIndex: "assessProject", key: "assessProject",align: 'center'},
    // { title: "考核项目次数", dataIndex: "assessProjectNum", key: "assessProjectNum",align: 'center' },
    // { title: "级别划分", dataIndex: "levelDivision", key: "levelDivision" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation',align: 'center' } },
];
/* 本页属性 表格数据源*/
var assessProjectTable = [];

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
    name: "assessmentProject",
    data() {
        return {
            //logog图片地址
            imgUrl: require("@/assets/logo.png"),
            columns,
            assessProjectTable,     // 授课基本信息数组
            // 模态框状态
            performanceVisible: false,
            formData:{
                assessProject:''       // 考核项目
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                assessProject:[{ required: true, message: "考核项目不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            departmentName:'',     // 查询的部门名称
            // 判断添加修改
            isAdd: true,
            // 分页
            pageination1:{
                current:1,      // 当前页数
                pageSize:10,     // 每页显示
                pageSizeOptions:['10','20','30'],
                showTotal:(total,range)=>{
                    return  '共' + total + '条'
                },
                showQuickJumper:true,
                showSizeChanger: true,
                total: 0
            },
        };
    },
    created() {
        this.getAssessProjects()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取绩效工资核算内容历史数据数据列表
        getAssessProjects() {
            axios.get('http://192.168.90.204:7999/data-manpower/findAssessProjectAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                console.log("data:",res);
                this.assessProjectTable = res.data
                // console.log("this.bank:" , this.assessProjectTable)
            })
        },
        // 点击按钮添加绩效工资内容词典
        addassessProjectTable() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.assessProject = ''
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
                        axios.post('http://192.168.90.204:7999/data-manpower/addAssessProject',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAssessProjects()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-manpower/updateAssessProject',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getAssessProjects()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addassessProjectTable"+qs.stringify(this.formData));
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
                        this.assessProjectTable = [res.data]
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
                        this.assessProjectTable = [res.data]
                    }
                })
            }
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getAssessProjects()
            }
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getAssessProjects()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            // this.formData.id = e.id
            this.formData.projectId = e.projectId,
            this.formData.assessProject = e.assessProject
            // this.formData.dutyDescription = e.dutyDescription,
            // this.formData.levelDivision = e.levelDivision
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                console.log(e);
                axios.post('http://192.168.90.204:7999/data-manpower/deleteAssessProject','projectId='+e.projectId).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getAssessProjects()
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
                    this.assessProjectTable = [res.data]
                })
            }
            
        },
        // 部门名称发生改变
        departmentNameChange() {
            if(this.departmentName == '') {
                this.getAssessProjects()
            }
        },
        // 分页
        handleTableChange2(pagination,filters,sorter) {
            console.log(pagination);
            this.pageination1.current = pagination.current
            this.pageination1.pageSize = pagination.pageSize
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