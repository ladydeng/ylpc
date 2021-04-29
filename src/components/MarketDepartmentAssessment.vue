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
                    时间类型：<a-select default-value="年" style="width: 120px" @change="handleChange">
                        <a-select-option value="年">
                            年
                        </a-select-option>
                        <a-select-option value="季度">
                            季度
                        </a-select-option>
                        <a-select-option value="月份">
                            月份
                        </a-select-option>
                     </a-select>
                </div>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工姓名" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="idChange" v-model="id" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="idSearch" />
                </div>
            </div>
        </div>
        <!-- 表格 -->
        <a-table :customRow="handleClickRow" :rowKey="record=>record.id" :columns="columns" :data-source="marketDepartmentTable">
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
 * 2021年02月25日      qcc           v1.0.0              市场部门考核基本信息
 * 
 */
import moment from 'moment';
import axios from 'axios'
const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "员工编号", dataIndex: "satffCode", key: "satffCode" },
    { title: "员工姓名", dataIndex: "EmployeeName", key: "EmployeeName" },
    // { title: "时间类型", dataIndex: "postName", key: "postName" },
    { title: "成交人数", dataIndex: "clinchDeal", key: "clinchDeal" },
    { title: "咨询人数", dataIndex: "consulting", key: "consulting" },
    { title: "上门人数", dataIndex: "doorNum", key: "doorNum" },
    { title: "回访人数", dataIndex: "payVisit", key: "payVisit" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' }
    },
];
export default {
    data() {
        return {
            columns,                      // 表头数据
            marketDepartmentTable:[{id:1,postId:2,postName:'nihao'}],     // 表格数据
            visible: false,      // 模态框状态
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
            console.log(date, dateString);
        },
        // 设置日期选择只能选择当前和之前日期
        disabledDate(current) {
            return current && current >moment().subtract(1, "days");
        },
        // 时间类型发生改变时
        handleChange() {
            
        },
        // 进入页面获取数据
        getMarketDepartmentTable() {
            axios.get('http://localhost:8080/data.json').then(res=>{
                console.log(res.status);
                console.log(res.data.content);
                this.marketDepartmentTable = res.data.content
            })
        }
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