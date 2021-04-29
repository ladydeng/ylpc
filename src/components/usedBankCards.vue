<template>
    <div>
        <!-- 搜索框 -->
        <!-- 添加曾用卡信息 -->
        <div>
            <div class="btn">
                <a-button @click="addUsedbankCard" type="primary">添加曾用卡信息</a-button>
                <div class="idSearch">
                    <a-input-search @change="staffChange" v-model="staffCode" style="width: 240px" placeholder="请输入您要查询的员工编号" enter-button @search="onStaffCodeSearch" />
                </div>
                <div class="idSearch">
                    <a-input-search @change="bankCardChange" v-model="bankCard" style="width: 240px" placeholder="请输入您要查询的银行卡号" enter-button @search="onbankCardSearch" />
                </div>
            </div>
            <!-- 模态框 -->
            <a-modal v-model="usedbankCardVisible" title="添加层用卡信息" :rules="rules" @ok="handleOk">
                    <a-form-model :rules="rules"  ref="formData" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                        <a-form-model-item v-if="!isAdd" label="ID">
                            <a-input disabled v-model="formData.id" />
                        </a-form-model-item>
                        <a-form-model-item prop= "staffCode" required label="员工编号">
                            <a-input v-model="formData.staffCode" />
                        </a-form-model-item>
                        <a-form-model-item prop= "bankName" required label="银行">
                            <a-input v-model="formData.bankName" />
                        </a-form-model-item>
                        <a-form-model-item prop="bankCard" required label="银行卡号">
                            <a-input v-model="formData.bankCard" />
                        </a-form-model-item>
                    </a-form-model>
            </a-modal>
        </div>
        <!-- 导出-->
        <a-button icon="download" @click="export2Excel">导出</a-button>
        <!-- <a-button icon="download" @click="importExcel">导入</a-button> -->
        <a-upload accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload">
<a-button type="primary">导入Excel</a-button>
        </a-upload>
        <!-- 表格 -->
        <a-table :rowKey="record=>record.id" :columns="columns" :data-source="bankCardTable">
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
 * 2021年1月21日      qcc           v1.1.0              新建页面、
 * /
import axios from "axios";
/* 本页属性 表格列头*/
import axios from 'axios'
import qs from 'qs'
import {validatebankCard} from "@/assets/js/vaildate.js";
// 银行卡验证规则
var validatorbankCard = (rule,value,callback) =>{
  if(!value) {
    return callback(new Error('银行卡号不能为空'))
  } else {
    if(validatebankCard(value)) {
      callback()
    } else {
      return callback(new Error('银行卡号格式不正确'))
    }
  }
};
const columns = [
//   { title: "ID", dataIndex: "id", key: "id" },
  { title: "员工编号", dataIndex: "staffCode", key: "staffCode" },
  { title: "银行", dataIndex: "bankName", key: "bankName" },
  { title: "银行卡号", dataIndex: "bankCard", key: "bankCard" },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'operation' } },
];
/* 本页属性 表格数据源*/
var bankCardTable = [];

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
 * 2021年01月21日      qcc            v1.0.0            新建曾用银行卡组件
 * 2021年01月21日      qcc            v1.0.1            根据id删除曾用银行卡信息
 * 
 * 
 */
var XLSX = require("xlsx");
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
        bankCardTable,
        // 模态框状态
        usedbankCardVisible: false,
        formData:{
            // id:'',
            bankCard:'',
            bankName:'',
            staffCode:'',
        },
        // 验证规则(对应a-form-model上的rules)
        rules:{
           bankName:[{ required: true, message: "银行名称不能为空", trigger: "blur" }],
           bankCard:[{validator: validatorbankCard,trigger:"blur"}],
           staffCode:[{ required: true, message: "员工编号不能为空", trigger: "blur" }],
        },
        staffCode:'',     //输入框要查询的员工编号
        bankCard:'',       // 要查询的银行卡号
        // 判断添加修改
        isAdd: true
    };
  },
  created() {
      this.getusedBankCardData()
  },
  methods:{
    // 点击表格某一行，拿到某一行的数据
    rowClick(record, index){
      return {
        
      }
    },
    // 银行卡数据信息
    getusedBankCardData() {
        axios.get('/api/usedBankCardData').then(res=>{
            // console.log("data:",res);
            this.bankCardTable = res.data
            // console.log("this.bank:" , this.bankCardTable)
        })
    },
    // 添加层用卡信息
    addUsedbankCard() {
        this.isAdd = true
        this.usedbankCardVisible = true
        // this.formData.id = '',
        // this.formData.staffCode = '',
        // this.formData.bankCard = '',
        // this.formData.bankName = ''
    },
    // 点击模态框确定按钮
    handleOk() {
        // 判断验证是否通过
        console.log(this.$refs);
        this.$refs['formData'].validate(valid=>{
            if(!valid) {
                this.usedbankCardVisible = true
                return
            } else {
                if(this.isAdd) {
                    // 获取添加信息
                    axios.post('/api/addUsedBankCard',qs.stringify(this.formData))
                    .then(res=>{
                        console.log(res);
                        // 重新获取数据
                        this.getusedBankCardData()
                    }).catch(err=>{
                        console.log(err);
                    })
                } else {
                    // 获取修改信息
                    axios.post('/api/upUsedBankCardById',qs.stringify(this.formData))
                    .then(res=>{
                        console.log('数据', res);
                        // 重新获取数据
                        this.getusedBankCardData()
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            }
        })
        // 模态框关闭
        
        // console.log("/api/addUsedBankCard"+qs.stringify(this.formData));
        // 如果点击添加按钮
        
        
        
    },
    // 根据员工编号查找银行卡信息
    onStaffCodeSearch() {
        axios.post('/api/findUsedBankCardByStaffCode','staffCode='+this.staffCode).then(res=>{
            if(this.staffCode == '') {
                alert('请输入员工编号')
            } else if(res.status == 200) {
                this.bankCardTable = res.data
            }
        })
    },
    // 员工编号发生改变时
    staffChange() {
        if(this.staffCode == '') {
            this.getusedBankCardData()
        }
    },
    // 根据曾用银行卡号查找银行卡信息
    onbankCardSearch() {
        axios.post('/api/findStaffByUsedBankCard','bankCard='+this.bankCard).then(res=>{
            console.log(res);
            if(this.bankCard == '') {
                alert('请输入银行卡号')
            } else if(res.status == 200) {
                // 返回员工编号
                this.staffCode = res.data
                // 调用员工编号查找数据
                this.onStaffCodeSearch()
            }
        })
    },
    // 银行卡号发生变化
    bankCardChange() {
        if(this.bankCard == '') {
            this.getusedBankCardData()
        }
    },
    // 编辑数据
    editor(e) {
        console.log(e);
        this.isAdd = false
        this.usedbankCardVisible = true
        this.formData.id = e.id
        this.formData.staffCode = e.staffCode,
        this.formData.bankCard = e.bankCard,
        this.formData.bankName = e.bankName
    },
    // 删除数据
    del(e) {
        console.log(e);
        if(confirm('确认删除吗？')) {
            axios.post('/api/removeUsedBankCardById','id='+e.id).then(res=>{
                console.log(res);
                if(res.status ==200) {
                    this.getusedBankCardData()
                }
            })
        } else {
            return;
        }
        
    },
    // 导出
    export2Excel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../excel/Export2Excel');//路径需要自行修改
          let tHeader = ['员工编号', '银行','银行卡号'];
          let filterVal = ['staffCode', 'bankName','bankCard'];
          let tTitle = '员工银行卡信息'
          const list = this.bankCardTable;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, tTitle);
        })
    },
    formatJson(filterVal, jsonData) {
        console.log(filterVal,jsonData);
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //   导入
    //导入excel
    beforeUpload(file) {
        console.log(11);
        let _this = this
        return new Promise(function(resolve, reject){
            _this.readExcel(file).then(result =>{
                if(result) resolve(result)
            })
        })
    },
    //解析Excel
    readExcel(file) {
        console.log(11);
        let _this = this
        return new Promise(function(resolve, reject){
            const reader = new FileReader()
            reader.onload =e=>{
                try {
                    let data = e.target.result, workbook = XLSX.read(data, {type: 'binary'})
                    const exlname = workbook.SheetNames[0] // 取第一张表
                    const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]) // 生成json表格内容
                    console.log(exl[0])
                    // let arr = []
                    // exl.map((v, i) => {
                    //     let obj = {}
                    //     //对获取的Excel数据进行操作
                    //     arr.push(obj)
                    // })
                    // console.log(exl);
                    // _this.dataSource = arr
                    // console.log(_this.dataSource);
                    // console.log(arr);
                    // exl.forEach()
                    var arr = []
                    for(let i =0;i<exl.length;i++) {
                        console.log(exl[i]);
                        // _this.bankCardTable.push(exl[i])
                        arr.push(exl[i])
                    }
                    console.log(arr);
                    // console.log(exl[i]);
                    // 获取添加信息
                    // axios.post('/api/addUsedBankCard',qs.stringify(this.formData))
                    // .then(res=>{
                    //     console.log(res);
                    //     // 重新获取数据
                    //     this.getusedBankCardData()
                    // }).catch(err=>{
                    //     console.log(err);
                    // })
                    
                    resolve()
                    console.log(_this.bankCardTable);
                } catch (e) {
                    reject(e.message)
                }
                
            }
            reader.readAsBinaryString(file)
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
    height: 32px;
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