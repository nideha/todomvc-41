;(function () {
	// 定义在外部是为了不把data撑得太大
	const todos=[
		{
			id:1,
			title:'吃饭',
			done:true
		},
		{
			id:2,
			title:'睡觉',
			done:false
		},
		{
			id:3,
			title:'打豆豆',
			done:true
		},
		{
			id:4,
			title:'敲代码',
			done:false
		}
	]
	new Vue({
		el:'#todoapp',
		data :{
			todos,  /* 相当于todos:todos */  /* 任务表数据 */
			inputText:'',  /* 用来绑定添加任务文本框的内容 */
			currentEdit:null,  /* 用来判定任务项是否获得editing样式的一个标记变量 */
			backTitle:''  /* 仅仅用于备份我们编辑之前的任务项的title，取消编辑回退 */
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
			}
		}
	})
})();
