// vue-cli 3.x 项目中使用vue.config.js作为项目的配置文件
// 这个文件在项目运行的时候会自动加载，加载一次后就不再加载
// 配置内容参考vue-cli配置参考
module.exports= {
    //导出配置对象
    devServer:{
        proxy:{
            // 代理选项
            "/api":{
                target: "http://yl.gateway.zzcedu.com/data-staff", // 代理的服务器地址
                changeOrigin: true, //是否允许改变源
                ws: true, //是否开启跨域
                changeOrigin: true, 
                pathRewrite:{   // 重写路径
                    "^/api":'/'  
                }
            },
        }
    }
}
