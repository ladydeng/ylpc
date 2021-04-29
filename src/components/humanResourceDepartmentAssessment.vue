<template>
    <div>
        <!-- 搜索框 -->
        <div>
            <div class="btn">
                
                <div class="idSearch">
                    请输入要查询的日期区间：<a-range-picker @change="onChange" :disabledDate="disabledDate" />
                </div>
                <!-- <div class="idSearch">
                    时间类型： <a-date-picker @change="onChange" />
                </div> -->
                <div class="idSearch">
                    时间类型：<a-select default-value="月" style="width: 120px" @change="handleChange">
                        <a-select-option value="年">
                            年
                        </a-select-option>
                        <a-select-option value="月">
                            月
                        </a-select-option>
                        <a-select-option value="天">
                            天
                        </a-select-option>
                     </a-select>
                </div>
                <div class="idSearch">
                    <a-input v-model="Time.staffCode" style="width: 200px" placeholder="请输入您要查询的员工编号" enter-button  />
                </div>
                <div class="idSearch">
                    <a-input v-model="Time.staffName" style="width: 200px" placeholder="请输入您要查询的员工姓名" enter-button />
                </div>
                <a-button type="primary" @click="Search">搜索</a-button>
            </div>
        </div>
        <!-- 表格 -->
        <a-table  :pagination="pageination1" :customRow="handleClickRow" :rowKey="record=>record.id" :columns="columns" :data-source="marketDepartmentTable">
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
 * @templateName: MarketDepartmentAssessment.vue
 * @Description: 市场部门考核基本信息
 *
 * @version: v1.0.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年02月25日      qcc           v1.0.0              人力资源部门考核基本信息
 * 2021年03月01日      qcc           v1.0.0              接口对接完成
 * 
 */
import moment from 'moment';
import axios from 'axios';
import qs from 'qs'
const columns = [
    { title: "ID", dataIndex: "manpowerId", key: "manpowerId" },
    { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
    { title: "员工姓名", dataIndex: "staffName", key: "staffName" },
    // { title: "考核项目", dataIndex: "assessProjec                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         t", key: "assessProject" },
    { title: "时间", dataIndex: "time", key: "time" },
    // { title: "时间类型", dataIndex: "postName", key: "postName" },
    // { title: "成交人数", dataIndex: "clinchDeal", key: "clinchDeal" },
    // { title: "咨询人数", dataIndex: "consulting", key: "consulting" },
    // { title: "上门人数", dataIndex: "doorNum", key: "doorNum" },
    // { title: "回访人数", dataIndex: "payVisit", key: "payVisit" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' }
    },
];
export default {
    data() {
        return {
            columns,                      // 表头数据
            marketDepartmentTable:[],     // 表格数据
            visible: false,      // 模态框状态
            Time:{
                beginTime:'2020-11-01',       // 开始时间
                endTime:'2021-03-01',          // 结束时间
                timeType:'月' ,                             // 时间类型
                staffName:'小强',                       // 员工姓名
                staffCode:'A0013'
            },
            manpowerId:'',      // 员工编号
            timeType:'',        // 时间类型
            employeeName:'',       // 员工姓名
            // page:1,        // 当前页数
            // pageSize:10,    // 每页显示
            pageination1:{
                current:1,      // 当前页数
                pageSize:2,     // 每页显示
                pageSizeOptions:['10','20','30'],
                showTotal:(total,range)=>{
                    return  '共' + total + '条'
                },
                showQuickJumper:true,
                showSizeChanger: true,
                total: 0
            },
        }
    },
    methods:{
        // 点击表格某一行，拿到某一行的数据
        handleClickRow(record, index){
            return {
                on: {
                    click: () => {
                      console.log(record,index)
                    //   this.drawChart()
                      //指定跳转地址
                      this.$router.push({path:'/echarts',query:{data: record }})
                    }
                }
            }
            
        },
        // 点击表格编辑按钮
        editor() {

        },
        // 点击表格删除按钮
        del() {

        },
        // 查询日期发生改变
        onChange(date, dateString) {
            // if(this.manpowerId == '')
            console.log(date, dateString);
            this.Time.beginTime = dateString[0]
            this.Time.endTime = dateString[1]
            console.log(this.Time);   
        },

        // 设置日期选择只能选择当前和之前日期
        disabledDate(current) {
            return current && current >moment().subtract(1, "days");
        },
        // 时间类型发生改变时
        handleChange(e) {
            console.log(e);
            this.Time.timeType = e
        },
        // 进入页面获取数据
        getMarketDepartmentTable() {
            axios.get('http://192.168.90.204:7999/data-manpower/findManpowerAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                console.log(res.data);
                this.marketDepartmentTable = res.data
            })
        },
        // 点击搜索按钮
        Search() {
            var _this = this
            axios({
                method:'post',
                url:'http://192.168.90.204:7999/data-manpower/findAssessProjectNum',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                params: _this.Time,
                transformRequest:[function() {
                    return JSON.stringify(_this.Time)
                }]
            }).then(res=>{
                if(res.status == 200) {
                    console.log('res',res.data);
                    this.marketDepartmentTable = [res.data]
                }
            })
        },
    },
    mounted() {
        this.getMarketDepartmentTable()
    }
}
</script>


<style scoped>
.btn {
    height: 64px;
}
.btn .idSearch {
    float: left;
    margin-left: 20px;
}
</style> 