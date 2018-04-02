;(function (window,Vue) {
	// 从本地存储中获取列表数据
	// JSON.parse将字符串转换为数组
	const todos=JSON.parse(window.localStorage.getItem('todos'))
const app=	new Vue({
		el:'#todoapp',
		data :{
			todos,  /* 相当于todos:todos */  /* 任务表数据 */
			inputText:'',  /* 用来绑定添加任务文本框的内容 */
			currentEdit:null,  /* 用来判定任务项是否获得editing样式的一个标记变量 */
			backTitle:'',  /* 仅仅用于备份我们编辑之前的任务项的title，取消编辑回退 */
			filterTodos:[], /* 循环遍历过滤后符号条件的数组 */
			hash:''
		},
		methods: {
			// addTodo(){
			// }
			// addTodo:function(){
			// }
			// 上边两个表达的是一个意思  都是函数
			// 添加任务项
			addTodo(e){
				// 拿到文本框数据
				const {inputText,todos}=this
				
				// 非空校验
				if(inputText.trim().length===0){
					return
				}
				// 获取唯一的id
				// 避免是空数组的时候拿到的元素是空
				const lastItem=todos[todos.length-1]
				const id=lastItem? lastItem.id+1:1
				// 添加到数组中
				todos.push({
					id,
					title:this.inputText,
					done:false
					
				})
				// 清空文本框
				this.inputText=''
				// console.log(123)
			},
			removeTodo(index){
				// 数组删除元素：splice(数组索引,删除个数)
				// 删除单个任务
				this.todos.splice(index,1)
			},
			getEditing(item){
				// 将currentEdit赋值给当前双击的任务项
				// item为当前双击的任务项
				
				this.currentEdit=item
				// 为了处理取消编辑，所以在这里获得编辑的时候先备份我们的被编辑的title
				// 用于取消编辑时，让任务项的title回到原始状态
				this.backTitle=item.title
			},
			// 回车或者失去焦点保存编辑
			// item为当前项
			saveEdit(item,index){
				// 判断被编辑的任务是否为空
				// 如果为空，直接删除，否则保存编辑，去除编辑样式
				if(item.title.trim().length===0){
					this.todos.splice(index,1)
				}else{
					// 去除编辑样式currentEdit
					this.currentEdit=null
				}
			},
			// ESC取消编辑
			cancelEdit(){
				
				// 备份之后再重置为null
				this.currentEdit.title=this.backTitle
				// 这里一旦取消编辑，则会导致blur的事件触发
				// blur事件函数saveEdit中又要访问this.currentEdit.title
				// 因为this.currentEdit已经在这被设置成null，所以会报错
				// null.title
				// 取消编辑，去除编辑样式
				this.currentEdit=null
			},
			// 清除所有已完成任务项
			clearAllDone(){
				const todos=this.todos
				for (let i = 0; i < todos.length; i++) {	
					// if(todos[i].done){}  为布尔值true	
					if(todos[i].done){
						// 执行删除操作
						todos.splice(i,1)
						// 不加i--的话，索引会错乱，删不干净
						// foreach无法控制索引错乱，for循环可以
						i--
					}
				}
			},
			// 切换所有任务的完成或未完成状态
			// toggleAll(e){
			// 	const checked=e.target
			// 	// 循环把复选框的状态赋值给所有任务项
			// 	this.todos.forEach(item => item.done=checked)
			// }
		},
		// 计算属性选项对象
		// 计算属性从代码来看本质是方法，但只能当属性来用，不能当方法来用，即调用的时候不能加括号
		// 计算属性就是带有行为的属性，且只能当属性来用
		// 计算属性会把计算的结果进行缓存，如果使用多次计算属性，实际上只调用了一次，要是方法的话就会用一次调用一次
		// 以后如果遇到需要绑定通过渲染一个方法的返回值，建议用计算属性

		// 计算属性的完整写法：
		// 		属性名:{
		//			 	get:function() {},  当访问该属性的时候，会自动调用get方法
		//			 	set:function() {},  当为该属性赋值的时候，会自动调用set方法
		//			 }
		//  属性名:function () {} 是
		// 		属性名:{
		//			get:function() {}
		//		}
		//		的简写方式

		// 计算属性可以直接按data里边的方法来访问
		computed: {
			remaining(){
				return this.todos.filter(item=>!item.done).length
			},


			// 切换所有任务复选框的状态
			// toggleAllstat(){
			// 	// every方法会对每一个元素执行条件判定
			// 	// 如果每个元素.done都为true，则every方法返回true
			// 	// 只要有一个为false，则返回值为false
			// 	const toggleAll=this.todos.every(function(item){
			// 		return item.done===true
			// 	})
			// 	return toggleAll
			// },

			// 计算属性本身不存储任何值，也无法重新赋值，它的值来源于get方法
			toggleAllstat:{
				get:function () {
					// every方法会对每一个元素执行条件判定
					// 如果每个元素.done都为true，则every方法返回true
					// 只要有一个为false，则返回值为false
					const toggleAll=this.todos.every(function(item){
						return item.done===true
					})
					return toggleAll
				},
				//当你打算给计算属性赋值的时候，就会自动调用set方法
				set:function(val){  
					// 获得CheckBox的选中状态，赋值给所有任务项
					// const checked=e.target
					// 循环把复选框的状态赋值给所有任务项
					this.todos.forEach(item => item.done=val)	
				}
				
				
			}
		},

		// watch 实例选项  监听对象是否发生改变
		// 默认状态下，只能监视对象或者数组成员的添加或者删除，说白了对象或者数组需要被深度监视才可以
		// watch 是一个对象
		// 对象的key必须是被监视的实例成员(data中的数据成员、计算属性中的成员)
		watch:{
			todos:{
				// 当todos发生改变的时候，会自动调用handler方法
				handler:function(){
					// 当todos发生改变的时候，将todos的数据同步到本地存储中
					//window.localStorage.setItem 将数据同步到本地存储中
					// JSON.stringify将数组转换为字符串
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
				},
				deep:true
				// 默认只能监视对象或者数组的一层数据，如果需要无级后代监视，则需要配置为深度监视(即 deep:true)
			}
		}
	})
	// 把app挂载到全局，这样就可以在控制台访问调试了
	window.app=app


	// onhashchange事件，只有锚点发生改变的时候才会调用，锚点不改变就不调用
	window.onhashchange=function(){
		// 结构赋值
		// window.location.href=“url”：改变url地址
		// window.location.replace(“url”)：将地址替换成新url
		// window.location中包含hash  
		const {hash}=window.location

		// 修改实例app中的属性hash从而影响用来过滤数据的a链接的样式
		app.hash=hash

		// 根据hash(地址栏中'#'后的标识)的不同 从而显示不同过滤方法所得到的数据的展示
		switch (hash) {
			// 显示数组中的全部数据
			case '#/':
				app.filterTodos=app.todos
				break;
			// 显示未完成的数据
			case '#/active':
				app.filterTodos=app.todos.filter(function(item){
					return item.done===false
				})
				break;
			// 显示已完成的数据
			case '#/completed':
				app.filterTodos=app.todos.filter(function(item){
					return item.done===true
				})
				break;	
		}
	}
	// 因为hash方法只有在发生改变的时候才会执行
	// 我们需要页面第一次进来的时候动态的根据 hash的标识 拿到过滤的数据
	// 所以我们一上来就手动的调用一次，初始化过滤显示我们的 filterTodos 数据
	window.onhashchange()
})(window,Vue);
