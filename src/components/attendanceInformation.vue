<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addDictionary" type="primary">添加出勤基本信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <!-- <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询用户ID" enter-button @search="idSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="changeAmountChange" v-model="changeAmount" style="width: 240px" placeholder="请输入要查询的更改金额" enter-button @search="changeAmountSearch" />
                </div> -->
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
                        <!-- <a-form-model-item prop="value" required label="课程类型">
                            <a-input v-model="formData.value" />
                        </a-form-model-item> -->
                        <a-form-model-item prop= "staff_code" required label="员工编号">
                            <a-input v-model="formData.staff_code" />
                        </a-form-model-item>
                        <a-form-model-item prop="month" required label="所属月份">
                            <a-input v-model="formData.month" />
                        </a-form-model-item>
                        <a-form-model-item prop= "attendance_day" label="应出勤天数">
                            <a-input v-model="formData.attendance_day" />
                        </a-form-model-item>    
                        <!-- <a-form-model-item prop="effectiveDate" required label="生效日期">
                            <a-input v-model="formData.effectiveDate" />
                        </a-form-model-item> -->
                        <!-- <a-form-model-item prop="changeDate" required label="更改时间">
                            <a-input v-model="formData.changeDate" />
                        </a-form-model-item> -->
                        <a-form-model-item prop="overtime_day" required label="加班天数">
                            <a-input v-model="formData.overtime_day" />
                        </a-form-model-item>
                        <a-form-model-item prop="days_off" required label="调休天数">
                            <a-input v-model="formData.days_off" />
                        </a-form-model-item>
                        <a-form-model-item prop="leave_day" required label="请假天数">
                            <a-input v-model="formData.leave_day" />
                        </a-form-model-item>
                        <a-form-model-item prop="clocking" required label="迟到早退">
                            <a-input v-model="formData.clocking" />
                        </a-form-model-item>
                        <a-form-model-item prop="nocheckin" required label="未打卡">
                            <a-input v-model="formData.nocheckin" />
                        </a-form-model-item>
                        <a-form-model-item prop="schuqin_day" required label="实际出勤天速">
                            <a-input v-model="formData.schuqin_day" />
                        </a-form-model-item>
                        <a-form-model-item prop="must_attendance_day" required label="月出勤基数">
                            <a-input v-model="formData.must_attendance_day" />
                        </a-form-model-item>
                        <!-- <a-form-model-item prop="changeType" required label="课程类别">
                            <a-select v-model="formData.changeType" style="width: 275px" @change="handleChange">
                                <a-select-option value="授课">
                                    授课
                                </a-select-option>
                                <a-select-option value="辅导">
                                    辅导
                                </a-select-option>
                            </a-select>
                        </a-form-model-item> -->
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
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="attendanceTable">
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
 * 2021年1月21日      qcc           v1.0.0              新建页面、绩效工资核算内容字典相关
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
    { title: "员工编号", dataIndex: "staff_code", key: "staff_code" },
    { title: "所属月份", dataIndex: "month", key: "month" },
    { title: "应出勤天数", dataIndex: "attendance_day", key: "attendance_day" },
    { title: "加班天数", dataIndex: "overtime_day", key: "overtime_day" },
    { title: "调休天数", dataIndex: "days_off", key: "days_off" },
    { title: "请假天数", dataIndex: "leave_day", key: "leave_day" },
    { title: "迟到早退", dataIndex: "clocking", key: "clocking" },
    { title: "未打卡", dataIndex: "nocheckin", key: "nocheckin" },
    { title: "实际出勤天数", dataIndex: "schuqin_day", key: "schuqin_day" },
    { title: "月出勤基准天数", dataIndex: "must_attendance_day", key: "must_attendance_day" },
    // { title: "原始内容", dataIndex: "originalContent", key: "originalContent" },
    // { title: "原始倍数", dataIndex: "originalMultiple", key: "originalMultiple" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var attendanceTable = [];

/**
 *
 * @Function: attendanceInformation.vue
 * @Description: 出勤基本信息
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
 * 2021年02月23日      qcc            v1.0.0             出勤基本信息、更改注释信息、出勤接口对接
 *  
 * 
 */
export default {
    /**
   * name:组件名称
   */
    name: "attendanceInformation",
    data() {
        return {
            //logog图片地址
            imgUrl: require("@/assets/logo.png"),
            columns,
            attendanceTable,     // 授课基本信息数组
            // 模态框状态
            performanceVisible: false,
            formData:{
                staff_code:'',      // 员工编号
                month:'',           // 所属月份
                attendance_day:'',  // 应出勤天数
                overtime_day:'',    // 加班天数
                days_off:'',        // 调休天数
                leave_day:'',       // 请假天数
                clocking:'',        // 迟到早退
                nocheckin:'',       // 未打卡
                schuqin_day:'',     // 实际出勤天数
                must_attendance_day:'',     // 月出勤基准天数
            },
            // 验证规则(对应a-form-model上的rules)
            rules:{
                staff_code:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
                month:[{ required: true, message: "所属月份不能为空", trigger: "blur" }],
                attendance_day:[{ required: true, message: "应出勤天数不能为空", trigger: "blur" }],
                overtime_day:[{ required: true, message: "加班天数不能为空", trigger: "blur" }],
                days_off:[{ required: true, message: "调休天数不能为空", trigger: "blur" }],
                leave_day:[{ required: true, message: "请假天数不能为空", trigger: "blur" }],
                clocking:[{ required: true, message: "迟到早退不能为空", trigger: "blur" }],
                nocheckin:[{ required: true, message: "未打卡天数不能为空", trigger: "blur" }],
                schuqin_day:[{ required: true, message: "实际出勤天数不能为空", trigger: "blur" }],
                must_attendance_day:[{ required: true, message: "月出勤基准天数不能为空", trigger: "blur" }],
            },
            staffCode:'',     //输入框要查询的员工编号
            // id:'',       // 要查询的id
            // changeAmount:'',     // 查询的更改额度
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
            axios.get('http://192.168.90.29:7999/data-check/findAll').then(res=>{
                console.log("data:",res);
                this.attendanceTable = res.data
                // console.log("this.bank:" , this.attendanceTable)
            })
        },
        // 点击按钮添加绩效工资内容词典
        addDictionary() {
            this.isAdd = true
            this.performanceVisible = true
            this.formData.staff_code='',      // 员工编号
            this.formData.month ='',           // 所属月份
            this.formData.attendance_day='',  // 应出勤天数
            this.formData.overtime_day='',    // 加班天数
            this.formData.days_off='',        // 调休天数
            this.formData.leave_day='',       // 请假天数
            this.formData.clocking='',        // 迟到早退
            this.formData.nocheckin='',       // 未打卡
            this.formData.schuqin_day='',     // 实际出勤天数
            this.formData.must_attendance_day=''     // 月出勤基准天数
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
                        axios.post('http://192.168.90.29:7999/data-check/saveAll',qs.stringify(this.formData))
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
                        axios.post('http://192.168.90.29:7999/data-check/updateCode',qs.stringify(this.formData))
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
        // console.log("/api/addDictionary"+qs.stringify(this.formData));
        // 如果点击添加按钮
        },
        // 员工编号发生改变时
        staffChange() {
            if(this.staffCode == '') {
                this.getAccountingContentDictionarys()
            }
        },
        // 员工编号查询
        onStaffCodeSearch() {
            console.log(this.staffCode);
            if(this.staffCode == '') {
                alert('请输入要查询的员工编号')
            } else {
                axios.get('http://192.168.90.29:7999/data-check/findByCode?staff_code='+ this.staffCode).then(res=>{
                    console.log(res);
                    this.attendanceTable = [res.data]
            })
            }
           
        },
        // 根据员工id获取绩效工资核算历史信息
        // idSearch() {
        //     axios.post('/api/accountingContentHistoryById','id='+this.id).then(res=>{
        //         console.log(res);
        //         if(this.id == '') {
        //             alert('请输入要查询的用户id')
        //         } else if(res.status == 200) {
        //             this.attendanceTable = [res.data]
        //         }
        //     })
        // },
        // // id搜索框发生变化
        // idChange() {
        //     if(this.id == '') {
        //         this.getAccountingContentDictionarys()
        //     }
        // },
        // 编辑数据
        editor(e) {
            console.log(e);
            this.isAdd = false
            this.performanceVisible = true
            this.formData.id = e.id
            this.formData.staff_code=e.staff_code,      // 员工编号
            this.formData.month =e.month,           // 所属月份
            this.formData.attendance_day=e.attendance_day,  // 应出勤天数
            this.formData.overtime_day=e.overtime_day,    // 加班天数
            this.formData.days_off=e.days_off,        // 调休天数
            this.formData.leave_day=e.leave_day,       // 请假天数
            this.formData.clocking=e.clocking,        // 迟到早退
            this.formData.nocheckin=e.nocheckin,       // 未打卡
            this.formData.schuqin_day=e.schuqin_day,     // 实际出勤天数
            this.formData.must_attendance_day=e.must_attendance_day     // 月出勤基准天数
        },
        // 删除数据
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.29:7999/data-check/deleteCode','id='+e.id).then(res=>{
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