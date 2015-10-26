# express-velocity
基于express搭建的velocity服务器

## 使用方式
Command:

	$ git clone https://github.com/tangjinzhou/express-velocity.git
	
	$ cd express-velcity
	
	$ npm install
	
	$ npm start
	
## 自定义配置

	//config.js配置文件
	
	module.exports = {
    	'viewsPath': 'vm/',		//模板文件路径
    	'staticPath': 'public'	//静态资源文件路径
	}
	
## 依赖
	
[express](http://expressjs.com/4x/api.html)

[velocity](https://github.com/fool2fish/velocity)