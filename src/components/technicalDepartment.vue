<template>
    <div>
        <!-- 搜索框 -->
        <div>
            <div class="btn">
                <a-button class="idSearch" @click="addTechnical" type="primary">添加技术部门考核内容</a-button>
                <div class="idSearch">
                    <a-input v-model="staffCode" style="width: 200px" placeholder="请输入您要查询的员工编号" enter-button   />
                </div>
                <div class="idSearch">
                    <a-input v-model="staffName" style="width: 200px" placeholder="请输入您要查询的员工姓名" enter-button />
                </div>
                <div class="idSearch">
                    <a-input v-model="technologyId" style="width: 240px" placeholder="请输入您要查询的考核数据编号" enter-button />
                </div>
                <a-button type="primary" @click="Search">搜索</a-button>
                <a-button style="margin-left:10px" type="primary" @click="reset">重置</a-button>
            </div>
        </div>
        <!-- 表格 -->
        <a-table @click="handleTableChange2" :pagination="pageination1" :customRow="handleClickRow" :rowKey="record=>record.id" :columns="columns" :data-source="marketDepartmentTable">
            <template slot="operation" slot-scope="text,record">
                <i @click="editor(record)">编辑</i> | <i @click="del(record)">删除</i>
            </template>
        </a-table>
        <!-- 模态框 -->
        <a-modal v-model="technicalVisible" :title="isAdd ? '添加技术部门考核内容':'修改技术部门考核内容'" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="数据编号">
                            <a-input disabled v-model="technologyId" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop="staffName" required label="员工姓名">
                            <a-input v-model="formData.staffName" />
                        </a-form-model-item>
                    </a-form-model>
        </a-modal>
    </div>
</template>


<script>

/**
 * Copyright: Copyright (c) 2020 云邻信息科技
 *
 * @templateName: MarketDepartmentformData.vue
 * @Description: 市场部门考核基本信息
 *
 * @version: v1.0.0
 * @author: Bai
 * @date: 2020年12月30日 上午9:45:17
 *
 * Modification History:<br>
 * Date             Author          Version            Description
 *---------------------------------------------------------*<br>
 * 2021年03月03日      qcc           v1.0.0              技术部门考核内容基本信息
 * 2021年03月03日      qcc           v1.0.0              接口对接完成
 * 
 */
import moment from 'moment';
import axios from 'axios';
import qs from 'qs'
const columns = [
    { title: "数据编号", dataIndex: "technologyId", key: "technologyId" },
    { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
    { title: "员工姓名", dataIndex: "staffName", key: "staffName" },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' }
    },
];
export default {
    data() {
        return {
            columns,                      // 表头数据
            marketDepartmentTable:[],     // 表格数据
            // 模态框状态
            technicalVisible: false,      // 模态框状态
            isAdd: true,                  // 判断添加修改
            formData:{
                staffCode:'',
                staffName:'',
            },
            staffName:'',
            staffCode:'',
            technologyId:'',      // 员工编号
            timeType:'',        // 时间类型
            employeeName:'',       // 员工姓名
            pageination1:{
                current: 2,      // 当前页数
                pageSize: 10,     // 每页显示
                pageSizeOptions:['10','20','30'],
                showTotal:(total,range)=>{
                    return  '共' + total + '条'
                },
                showQuickJumper:true,
                showSizeChanger: true,
                total: 0,
                onShowSizeChange:(current, pageSize)=>{
                    console.log(current,pageSize);
                    this.pageination1.pageSize = pageSize
                    this.getMarketDepartmentTable()
                },
                onChange:(current,size)=>{
                    console.log(current,size);
                    this.pageination1.current = current;
                    this.pageination1.pageSize = size;
                    this.getMarketDepartmentTable()
                }
            },
            rules:{
                staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
                // changeDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                // effectiveDate:[{validator: validatorDate,trigger:"blur"}],      // 更改时间
                staffName:[{ required: true, message: "员工姓名不能为空", trigger: "blur" }],
                // dutyDescription:[{ required: true, message: "职责描述不能为空", trigger: "blur" }],
                // levelDivision:[{ required: true, message: "级别划分不能为空", trigger: "blur" }],
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
                    //   this.$router.push({path:'/echarts',query:{data: record }})
                    }
                }
            }
            
        },
        // 点击表格编辑按钮
        editor(e) {
            console.log(e);
            this.technicalVisible = true
            this.technologyId = e.technologyId
            this.formData.staffName = e.staffName
            this.formData.staffCode = e.staffCode
        },
        // 点击表格删除按钮
        del(e) {
            console.log(e);
            if(confirm('确认删除吗？')) {
                axios.post('http://192.168.90.204:7999/data-technology/deleteTechnology','technologyId='+e.technologyId).then(res=>{
                    console.log(res);
                    if(res.status ==200) {
                        this.pageination1.current = 1
                        this.total()
                        this.getMarketDepartmentTable()
                    }
                })
            } else {
                return;
            }
        },
        // 进入页面获取数据
        getMarketDepartmentTable() {
            axios.get('http://192.168.90.204:7999/data-technology/findTechnologyAll?page='+ this.pageination1.current + '&pageSize=' + this.pageination1.pageSize).then(res=>{
                console.log(res.data);
                this.marketDepartmentTable = res.data
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
        // 点击添加按钮
        addTechnical() {
            this.technicalVisible = true
            
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
                    url:'http://192.168.90.204:7999/data-technology/findTechnology',
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
                            this.marketDepartmentTable = [res.data]
                        } else {
                            this.marketDepartmentTable=[]
                        }
                        
                    }
                })
            
        },
        // 分页
        handleTableChange2(pagination,filters,sorter) {
            console.log(pagination,filters,sorter)
            this.getMarketDepartmentTable()
        },
        fetch(params = {}) {
            console.log('params:', params);
        },
        // 点击模态框确定按钮
        handleOk() {
            // 判断验证是否通过
            this.$refs['formData'].validate(valid=>{
                if(!valid) {
                    this.technicalVisible = true
                    console.log(valid == true);
                    return
                } else {
                    if(this.isAdd) {
                        // 添加绩效工资核算
                        console.log(this.formData);
                        axios.post('http://192.168.90.204:7999/data-technology/addTechnology',qs.stringify(this.formData))
                        .then(res=>{
                            console.log(res);
                            if(res.status == 200) {
                                // console.log(res);
                                this.technicalVisible = false
                                // 重新获取数据
                                this.getMarketDepartmentTable()
                                this.getTotal()
                        }
                        }).catch(err=>{
                            console.log(err);
                        })
                    } else {
                        // 获取修改信息
                        axios.post('http://192.168.90.204:7999/data-technology/updateTechnology',qs.stringify(this.formData))
                        .then(res=>{
                            if(res.status == 200) {
                                console.log('数据', res);
                                this.technicalVisible = false
                                // 重新获取数据
                                this.getAccountingContentDictionarys()
                            }
                        
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                }
            })
        },
        handleChange(value) {
            console.log(`selected ${value}`);
        },
        // 查询列表总数
        getTotal() {
            axios.post('http://192.168.90.204:7999/data-technology/findTechnologyAllTotal').then(res=>{
                console.log(res);
                this.pageination1.total = res.data
            })
        },
    },
    mounted() {
        this.getMarketDepartmentTable()
        this.getTotal()
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