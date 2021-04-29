<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addEducational" type="primary">添加教师基本信息</a-button>
                <!-- <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的部门编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="departmentNameChange" v-model="departmentName" style="width: 240px" placeholder="请输入要查询的部门名称" enter-button @search="departmentNameSearch" />
                </div> -->
                <!-- <div class="idSearch"> -->
                <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                <!-- 更改日期：<a-date-picker @change="onEffectiveDate" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加教师基本信息':'修改教师基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.teacherId" />
                        </a-form-model-item>
                        <a-form-model-item prop= "teacherCode" required label="教师编号">
                            <a-input v-model="formData.teacherCode" />
                        </a-form-model-item>
                        <a-form-model-item prop="teacherName" required label="教师姓名">
                            <a-input v-model="formData.teacherName" />
                        </a-form-model-item>
                        <a-form-model-item prop= "division" label="所属科别">
                            <a-input v-model="formData.division" />
                        </a-form-model-item>    
                        <a-form-model-item prop="lessonsType" required label="授课类型">
                            <a-select v-model="formData.lessonsType" style="width: 275px" @change="handleChange">
                                <a-select-option value="1">
                                    讲课
                                </a-select-option>
                                <a-select-option value="2">
                                    辅导
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop= "lessonsTime" label="授课时长(天)">
                            <a-input v-model="formData.lessonsTime" />
                        </a-form-model-item> 
                        <a-form-model-item prop= "classId" label="授课班级编号">
                            <a-input v-model="formData.classId" />
                        </a-form-model-item> 
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :pagination="pageination1" :rowKey="record=>record.id" :columns="columns" :data-source="deparInforTable">
            <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
            <template slot="operation" slot-scope="text,record">
                <i @click="editor(record)">编辑</i> | <i @click="del(record)">删除</i>
            </template>
            <span></span>
        </a-table>
    </div>
</template>

<script>
/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: educationalAdministration.vue
 * @Description:  教师课时统计
 * 
 *
 * @version: v1.1.0
 * @author: qcc
 * @date: 2021年03月02日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年03月02日      qcc           v1.0.0                 教师课时统计
 * 2021年03月06日      qcc           v1.0.1                 接口对接
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
    // { title: "教师编号", dataIndex: "id", key: "id" },
    { title: "教师数据编号", dataIndex: "teacherId", key: "teacherId" },
    { title: "教师编号", dataIndex: "teacherCode", key: "teacherCode" },
    { title: "教师姓名", dataIndex: "teacherName", key: "teacherName" },
    { title: "所属科别", dataIndex: "division", key: "division" },
    { title: "授课类型", dataIndex: "lessonsType", key: "lessonsType" },
    { title: "授课时长(天)", dataIndex: "lessonsTime", key: "lessonsTime" },
    { title: "授课班级编号", dataIndex: "classId", key: "classId" },
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
                teacherCode:'',    // 教师编号
                teacherName:'',    // 教师姓名
                // teacherId:'',      // 教师数据编号
                division:'',       // 所属科别
                lessonsType:'',    // 授课类型
                lessonsTime:'',    // 授课时长
                classId:'',        // 授课班级编号
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
                    this.getEducationals()
                },
                onChange:(current,size)=>{
                    // console.log(current,size);
                    this.pageination1.current = current;
                    this.pageination1.pageSize = size;
                    this.getTotal()
                    this.getEducationals()
                }
            },
        };
    },
    created() {
        this.getTotal()
        this.getEducationals()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取所有教师信息列表
        getEducationals() {
            axios.get('http://192.168.90.204:7999/data-educational/findTeacherAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                console.log("data:",res);
                this.deparInforTable = res.data
                // console.log("this.bank:" , this.deparInforTable)
            })
        },
        // 点击按钮添加绩效工资内容词典
        addEducational() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.teacherName = '',
            this.formData.teacherCode = '',
            this.formData.division = '',
            this.formData.lessonsType = '',
            this.formData.lessonsTime = '',
            this.formData.classId = ''
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
                        axios.post('http://192.168.90.204:7999/data-educational/addTeacher',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getEducationals()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-educational/upDepartmentById',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getEducationals()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addEducational"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工id查询
        idSearch() {
            if(this.id == '') {
                alert('请输入要查询的用户id')
            } else {
                axios.post('http://192.168.90.204:7999/data-educational/findDepartmentById','id='+this.id).then(res=>{
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
                axios.post('http://192.168.90.204:7999/data-educational/findByDepartmentId','departmentId='+this.staffCode).then(res=>{
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
                this.getEducationals()
            }
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getEducationals()
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
                axios.post('http://192.168.90.204:7999/data-educational/delDepartmentById','id='+e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getEducationals()
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
                axios.post('http://192.168.90.204:7999/data-educational/findByDepartmentName','departmentName=' + this.departmentName).then(res=>{
                    console.log(res);
                    this.deparInforTable = [res.data]
                })
            }
            
        },
        // 部门名称发生改变
        departmentNameChange() {
            if(this.departmentName == '') {
                this.getEducationals()
            }
        },
        // 总条数
        getTotal() {
            axios.post('http://192.168.90.204:7999/data-educational/findTeacherAllTotal').then(res=>{
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