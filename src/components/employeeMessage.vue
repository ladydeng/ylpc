<template>
    <a-layout>
         <!-- tabs发生改变  @change="tabsChange" -->
         <!-- 此页面根据员工编号获取用户相关信息 -->
        <a-tabs default-active-key="1" >
            <a-tab-pane v-for="(item,index) in messageType" :key="index" :tab="item">
                <!-- {{item}}{{index}} -->
                
                <!-- 历史银行卡记录 -->
                <a-table v-if="index==0" :columns="columns" :data-source="data" :rowKey="record=>record.id">
                    <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
                </a-table>
                <!-- 紧急联系人 -->
                <a-table v-if="index==1" :columns="emergencyContact" :data-source="emergencyContactData" :rowKey="record=>record.id">
                    <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
                </a-table>
                <!-- 历史电话记录 -->
                <a-table v-if="index==2" :columns="oncePhone" :data-source="oncePhoneData" :rowKey="record=>record.id">
                    <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
                </a-table>
                <!-- 工资基本信息 -->
                <a-table v-if="index==3" :columns="basicSalary" :data-source="basicSalaryData" :rowKey="record=>record.id">
                    <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    
    /**
 *
 * @Function: EmployeeMessage.vue
 * @Description: 对外暴露数据
 *
 * @return：name,data(),created(),methods
 * @throws：异常描述
 *
 * @version: v1.0.0
 * @author: qcc
 * @date: 2021年1月20日 08:56:46
 *
 * Modification History:<br>
 * Date              Author          Version            Description
 *----------------------------------------------------------------*<br>
 * 2021年1月20日     qcc             v1.0.0                 联系人相关信息
 */
import axios from 'axios'
import fs from 'fs'
const messageType = ['历史银行卡记录','紧急联系人','历史电话记录','工资基本信息']
const columns = 
[{ title: '姓名',key: 'name',dataIndex: 'name'},
{title: 'id',dataIndex: 'id',key: 'id',ellipsis: true},
{title: '数据编号',dataIndex: 'staffCode',key: 'staffCode'},
{title: '银行',dataIndex: 'bankName',key: 'bankName', ellipsis: true,},
{title: '卡号',dataIndex: 'bankCard',key: 'bankCard',ellipsis: true,}]
// 紧急联系人数据
const emergencyContact = 
[{ title: '姓名',key: 'name',dataIndex: 'name'},
{title: 'id',dataIndex: 'id',key: 'id',ellipsis: true},
{title: '数据编号',dataIndex: 'staffCode',key: 'staffCode'},
{title: '联系人姓名',dataIndex: 'contactName',key: 'contactName', ellipsis: true},
{title: '联系人电话',dataIndex: 'contactPhone',key: 'contactPhone', ellipsis: true,},
{title: '联系人关系',dataIndex: 'contactRelationship',key: 'contactRelationship',ellipsis: true,}];
// 紧急联系人数据
const oncePhone = 
[{ title: '姓名',key: 'name',dataIndex: 'name'},
{title: 'id',dataIndex: 'id',key: 'id',ellipsis: true},
{title: '数据编号',dataIndex: 'staffCode',key: 'staffCode'},
{title: '曾用电话',dataIndex: 'phoneNumber',key: 'phoneNumber', ellipsis: true}];
// 工资信息
const basicSalary = 
[{ title: '姓名',key: 'name',dataIndex: 'name'},
{title: 'id',dataIndex: 'id',key: 'id',ellipsis: true},
{title: '数据编号',dataIndex: 'staffCode',key: 'staffCode'},
{title: '曾用电话',dataIndex: 'phoneNumber',key: 'phoneNumber', ellipsis: true}];
export default {
    name:'EmployeeMessage',
    data() {
        return {
            //tab切换列表
            messageType,
            // 历史银行卡表格内容
            data:[],
            // 历史银行卡列头基础信息
            columns,
            // 联系人信息
            emergencyContact,
            // 紧急联系人数据
            emergencyContactData:[],
            // 曾用电话
            oncePhone,
            // 曾用电话数据
            oncePhoneData:[],
            // 工资信息
            basicSalary,
            // 工资信息数据
            basicSalaryData:[]
        }
    },
    created() {
        // 获取个人历史银行卡记录信息
        axios.post('/api/findUsedBankCardByStaffCode','staffCode=' + this.$route.query.staffCode).then(res=>{
            // console.log(res);
            // 响应结果
            // console.log(res.data);
            // 状态码返回200，数据获取成功
            if(res.status == 200) {
                this.data=res.data
            }
        })
        // 获取个人紧急联系人信息
        axios.post('/api/staffEmergencyContencts','staffCode=' + this.$route.query.staffCode).then(res=>{
            // console.log(res);
            // 响应结果
            // console.log(res.data);
            // 状态码返回200，数据获取成功
            if(res.status == 200) {
                this.emergencyContactData=res.data
            }
        })
        // 获取个人曾用电话
        axios.post('/api/findPhones','staffCode=' + this.$route.query.staffCode).then(res=>{
            // console.log(res);
            // 响应结果
            // console.log(res.data);
            // 状态码返回200，数据获取成功
            if(res.status == 200) {
                // this.emergencyContactData=res.data
                this.oncePhoneData = res.data
            }
        })
    },
    methods:{
        // tabs标签发生改变
        // tabsChange(key) {
        //     console.log(key);
        // }
    }
};
</script>


<style scoped>
/* logo容器 */
.logo-container {
  height: 32px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px;
  line-height: 32px;
}
</style>