<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addCourseInformation" type="primary">添加课程基本信息</a-button>
                <!-- <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div> -->
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <!-- <div class="idSearch">
                    <a-input-search @change="changeAmountChange" v-model="changeAmount" style="width: 240px" placeholder="请输入要查询的更改金额" enter-button @search="changeAmountSearch" />
                </div> -->
                <!-- <div class="idSearch"> -->
                    <!-- <a-input-search @change="DataChange" v-model="changeData" style="width: 240px" placeholder="请输入您要查询的更新日期" enter-button @search="onDataSearch" /> -->
                    <!-- 更改日期：<a-date-picker @change="onEffectiveDate" />
                </div> -->
            </div>
            <!-- 模态框 -->
            <a-modal v-model="performanceVisible" :title="isAdd ? '添加课程基本信息':'修改课程基本信息'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop="courseInfo" required label="课程详情">
                            <a-input v-model="formData.courseInfo" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeAmount" required label="更改金额">
                            <a-input v-model="formData.changeAmount" />
                        </a-form-model-item>
                        <a-form-model-item prop= "changeContent" label="更改内容">
                            <a-input v-model="formData.changeContent" />
                        </a-form-model-item>    
                        <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeDate" required label="更改时间">
                            <a-input v-model="formData.changeDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="changeMultiple" required label="更改倍数">
                            <a-input v-model="formData.changeMultiple" />
                        </a-form-model-item> -->
                        <a-form-model-item prop="courseType" required label="课程类型">
                            <a-select v-model="formData.courseType" style="width: 275px" @change="handleChange">
                                <a-select-option value="授课">
                                    授课
                                </a-select-option>
                                <a-select-option value="辅导">
                                    辅导
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item prop="courseDate" required label="课程时长">
                            <a-input v-model="formData.courseDate" />
                        </a-form-model-item>
                        <a-form-model-item prop="courseNumber" required label="课程编号">
                            <a-input v-model="formData.courseNumber" />
                        </a-form-model-item>
                        <a-form-model-item prop="courseName" required label="课程名称">
                            <a-input v-model="formData.courseName" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop="giveTeacher" required label="原始内容">
                            <a-input v-model="formData.giveTeacher" />
                        </a-form-model-item>
                        <a-form-model-item prop="originalMultiple" required label="原始倍数">
                            <a-input v-model="formData.originalMultiple" />
                        </a-form-model-item> -->
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="controllerTable">
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
 * @templateName: courseInformation.vue
 * @Description: 授课基本信息
 * 
 *
 * @version: v1.1.0
 * @author: qcc
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年1月21日      qcc           v1.0.0              授基本信息
 * 2021年1月23日      qcc           v1.0.1              更改注释信息、接口对接
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
    { title: "课程详情", dataIndex: "courseInfo", key: "courseInfo" },
    { title: "课程名称", dataIndex: "courseName", key: "courseName" },
    { title: "课程编号", dataIndex: "courseNumber", key: "courseNumber" },
    { title: "课程类型", dataIndex: "courseType", key: "courseType" },
    { title: "授课时长", dataIndex: "courseDate", key: "courseDate" },
    // { title: "更改时间", dataIndex: "changeDate", key: "changeDate" },
    // { title: "更改内容", dataIndex: "changeContent", key: "changeContent" },
    // { title: "更改倍数", dataIndex: "changeMultiple", key: "changeMultiple" },
    // { title: "原始金额", dataIndex: "originalAmount", key: "originalAmount" },
    // { title: "更改类型", dataIndex: "changeType", key: "changeType" },
    // { title: "原始内容", dataIndex: "originalContent", key: "originalContent" },
    // { title: "原始倍数", dataIndex: "originalMultiple", key: "originalMultiple" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var controllerTable = [];

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
 * 2021年02月23日      qcc            v1.0.0              授课相关完结
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
            controllerTable,     // 授课基本信息数组
            // 模态框状态
            performanceVisible: false,
            formData:{
                courseInfo:'',     // 课程详情
                courseName:'',    // 课程名称
                courseDate:'',   // 课程时长
                courseNumber:'',   // 课程编号
                // changeMultiple:'',   // 更改倍数
                // staffCode:'',
                courseType:'',     // 课程类型
                // originalAmount:'',     // 原始金额
                // originalContent:'',      // 原始内容
                // originalMultiple:'',      // 原始倍数
                // value:'',    //     字典内容
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                courseInfo:[{ required: true, message: "更改不能为空", trigger: "blur" }],
                courseDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                // effectiveDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                courseName:[{ required: true, message: "更改内容不能为空", trigger: "blur" }],
                courseNumber:[{ required: true, message: "更改倍数不能为空", trigger: "blur" }],
                courseType:[{ required: true, message: "更改类型不能为空", trigger: "blur" }],
                // originalAmount:[{ required: true, message: "原始金额不能为空", trigger: "blur" }],
                // originalContent:[{ required: true, message: "原始内容不能为空", trigger: "blur" }],
                // originalMultiple:[{ required: true, message: "原始倍数不能为空", trigger: "blur" }],
                // value:[{ required: true, message: "字典内容不能为空", trigger: "blur" }],
            },
            // staffCode:'',     //输入框要查询的员工编号
            id:'',       // 要查询的id
            // changeAmount:'',     // 查询的更改额度
            // 判断添加修改
            isAdd: true
        };
    },
    created() {
        this.getcourseInfoController()
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        rowClick(record, index){
            return {
            
            }
        },
        // 获取绩效工资核算内容历史数据数据列表
        getcourseInfoController() {
            axios.get('http://192.168.90.21:7999/teaching-management/course/findAll').then(res=>{
                // console.log("data:",res);
                this.controllerTable = res.data
                // console.log("this.bank:" , this.controllerTable)
            })
        },
        // 点击按钮添加绩效工资内容词典
        addCourseInformation() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.courseDate = ''
            this.formData.courseInfo = '',
            this.formData.courseName = '',
            this.formData.courseNumber = '',
            this.formData.courseType = ''
            // this.formData.contentNumber = '1'

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
                        axios.post('http://192.168.90.21:7999/teaching-management/course/insert',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log(res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getcourseInfoController()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.21:7999/teaching-management/course/update',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                // console.log('数据', res);
                                this.performanceVisible = false
                                // 重新获取数据
                                this.getcourseInfoController()
                            }
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        // console.log("/api/addCourseInformation"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 根据员工id获取绩效工资核算历史信息
        idSearch() {
            axios.get('http://192.168.90.21:7999/teaching-management/course/finById?id='+this.id).then(res=>{
                console.log(res.data);
                if(this.id == '') {
                    alert('请输入要查询的用户id')
                } else if(res.status == 200) {
                    // console.log(res.data);
                    // console.log(res.data == '');
                    if(res.data == '') {
                        this.controllerTable = []
                    } else {
                        this.controllerTable = [res.data]
                    }
                }
            })
        },
        // id搜索框发生变化
        idChange() {
            if(this.id == '') {
                this.getcourseInfoController()
            }
        },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.formData.id = e.id
            this.formData.courseDate = e.courseDate,
            this.formData.courseInfo = e.courseInfo,
            this.formData.courseName = e.courseName,
            this.formData.courseNumber = e.courseNumber,
            this.formData.courseType = e.courseType
        },
        // 删除数据
        del(e) {
            // console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.21:7999/teaching-management/course/delete','id='+ e.id).then(res=>{
                    // console.log(res);
                    if(res.status ==200) {
                        this.getcourseInfoController()
                    }
                })
            } else {
                return;
            }
        },
        handleChange(value) {
            console.log(`selected ${value}`);
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