<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addtechnologyTable" type="primary">添加部门基本信息</a-button>
                <div class="idSearch">
                    <a-input v-model="staffCode" style="width: 200px" placeholder="请输入您要查询的员工编号" enter-button   />
                </div>
                <div class="idSearch">
                    <a-input v-model="staffName" style="width: 200px" placeholder="请输入您要查询的员工姓名" enter-button />
                </div>
                <div class="idSearch">
                    <a-input v-model="technologyId" style="width: 240px" placeholder="请输入您要查询的考核数据编号" enter-button />
                </div>
                <a-button style="margin: 0 10px"  type="primary" @click="Search">搜索</a-button>
                <a-button style="margin: 0 10px" type="primary" @click="reset">重置</a-button>
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加出勤基本信息':'修改出勤基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="projectId" />
                        </a-form-model-item>
                        <a-form-model-item prop= "assessProject" required label="考核项目">
                            <a-input v-model="formData.assessProject" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table  :pagination="pageination1" :customRow="handleClickRow" :rowKey="record=>record.id" :columns="columns" :data-source="technologyTable">
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
    { title: "数据编号", dataIndex: "projectId", key: "projectId" },
    { title: "考核项目", dataIndex: "assessProject", key: "assessProject" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' },}

];
/* 本页属性 表格数据源*/
var technologyTable = [];

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
 * 2021年03月03日      qcc            v1.0.0             技术项目列表
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
            technologyTable,     // 授课基本信息数组
            // 模态框状态
            performanceVisible: false,
            formData:{
                assessProject:'',       //考核项目
            },
            projectId:'',        // 考核项目数据编号
            // 验证规则(对应a-form-model上的rules)
            rules:{
                assessProject:[{ required: true, message: "考核项目不能为空", trigger: "blur" }],
            },
            staffName:'',
            staffCode:'',
            technologyId:'',      // 员工编号
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
                    this.getAccountingContentDictionarys()
                },
                onChange:(current,size)=>{
                    // console.log(current,size);
                    this.pageination1.current = current;
                    this.pageination1.pageSize = size;
                    this.getTotal()
                    this.getAccountingContentDictionarys()
                }
            },
        };
    },
    created() {
        this.getAccountingContentDictionarys()
        this.getTotal()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        handleClickRow(record, index){
            return {
                on: {
                    click: () => {
                    }
                }
            }
            
        },
        // // 分页
        // handleTableChange2(pagination,filters,sorter) {
        //     console.log(pagination);
        //     this.pageination1.current = pagination.current
        //     this.pageination1.pageSize = pagination.pageSize
        // },
        // 获取绩效工资核算内容历史数据数据列表
        getAccountingContentDictionarys() {
            axios.get('http://192.168.90.204:7999/data-technology/findAssessProjectAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                this.technologyTable = res.data
                console.log(res);
            })
        },
        // 点击按钮添加绩效工资内容词典
        addtechnologyTable() {
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
                        axios.post('http://192.168.90.204:7999/data-technology/addAssessProject',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getTotal()
                                this.getAccountingContentDictionarys()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-technology/updateAssessProject',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getTotal()
                                this.getAccountingContentDictionarys()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addtechnologyTable"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 点击搜索按钮
        Search() {
            var _this = this
            if(this.staffCode == '' && this.staffName == '' && this.technologyId=='') {
                alert('请至少输入一个')
                return;
            } else if(this.staffCode == ''&& this.staffName == '') {
                this.assessData = {
                    staffCode: this.staffCode,
                    technologyId: this.technologyId 
                } 
            }  else if(this.technologyId == ''&& this.staffCode == '') {
                this.assessData = {
                    staffCode: this.staffCode,
                    staffName: this.staffName 
                } 
            } else if(this.technologyId == ''&& this.staffName == '') {
                this.assessData = {
                    staffCode: this.staffCode,
                } 
            } 
            console.log(this.assessData);
                axios({
                    method:'post',
                    url:'http://192.168.90.204:7999/data-technology/findAssessProjectByTechnology',
                    // headers: {
                    //     'Content-Type': 'application/json;charset=UTF-8'
                    // },
                    params: _this.assessData,
                    // transformRequest:[function() {
                    //     return JSON.stringify(_this.formData)
                    // }]
                }).then(res=>{
                    console.log(res);
                    if(res.status == 200) {
                        console.log('res',res.data);
                        if(res.data != '') {
                            this.technologyTable = res.data
                        } else {
                            this.technologyTable=[]
                        }
                        
                    }
                })
            
        },
        // 点击重置按钮
        reset() {
            // console.log(this.formData);
            this.staffCode = '' ,
            this.staffName = '' ,
            this.technologyId='',
            this.pageination1.current = 1
            this.getMarketDepartmentTable()
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.projectId = e.projectId
            this.formData.assessProject = e.assessProject
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.204:7999/data-technology/deleteAssessProject','projectId='+e.projectId).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getTotal()
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
        // departmentNameSearch() {
        //     if(this.departmentName =='') {
        //         alert('请输入要查询的部门名称')
        //     } else {
        //         axios.post('http://192.168.90.204:7999/data-department/findByDepartmentName','departmentName=' + this.departmentName).then(res=>{
        //             console.log(res);
        //             this.technologyTable = [res.data]
        //         })
        //     }
            
        // },
        // // 部门名称发生改变
        // departmentNameChange() {
        //     if(this.departmentName == '') {
        //         this.getAccountingContentDictionarys()
        //     }
        // },
        // 项目列表总数
        getTotal() {
            axios.post('http://192.168.90.204:7999/data-technology/findAssessProjectAllTotal').then(res=>{
                console.log(res);
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