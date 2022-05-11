<template>
	<div class='pop-ups' v-if='modifyShow'>
		<div class='declare-authorization'>
			<h4>人脸识别授权协议书</h4>
			<p v-for="(item,index) in popContent" :key="index">{{item}}</p>
			<!-- <p>1、本人明确知晓并同意授权中宏人寿保险有限公司（中宏人寿）获取包括本人头像照在内本人个人信息运用于为本人提供的保单业务；</p>
			<p>2、本人同时授权为保单业务提供技术服务的第三方合法征信机构有权获取本人的个人信息，中宏人寿将要求第三方合法征信机构对本人的个人信息提供符合中国法律法规规定的保护；</p>
			<p>3、本人明确知晓并同意，通过微信提交的所有资料都会经过微信运营商的存储服务器，处于微信运营商控制下的客户资料的信息安全及隐私保护责任由微信运营商负责，适用微信运营商的信息安全及隐私保护政策。</p> -->
			<div class='bottom-btn'>
				<span class='confirm-btn' @click='confirmBtn'>我接受</span>
				<span class="cancel-btn" @click="cancelBtn">取消</span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			agreementContent:{
				default: "",
			},
		},
		data () {
			return {
				modifyShow: false,
				popContent: [],
			}
		},
		mounted() {
			this.popContent = this.agreementContent.split(/[；;]/)
		},
		methods: {
			isShow () {
				this.modifyShow = true
			},
			// 接受协议按钮
			confirmBtn () {
				this.modifyShow = false
				this.$emit('confirmBtn')
			},
			// 取消按钮
			cancelBtn () {
				this.modifyShow = false
				this.$emit('cancelBtn')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.pop-ups {
		width: 100%;
		height: 100%;
		background:rgba(0,0,0,0.5);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1000;
		.declare-authorization {
			margin: 0 auto;
			position: relative;
			top: 25%; 
			width: 300px;
			max-height: 400px;
			// height: 300px;
			background-color: #fff;
			overflow: auto;
			h4 {
				text-align: center;
				padding: 20px 0px 15px 0px;
			}
			h6 {
				padding: 0px 15px 0px 15px;
			}
			p {
				padding: 8px 15px 0px 15px;
				font-size: 12px;
				color: #333;
			}
			.bottom-btn {
				display: flex;
				flex-wrap: nowrap;
				margin-top: 20px;
				span {
					width: 50%;
					height: 50px;
					line-height: 50px;
					text-align: center;
					color: #ffffff;
				}
				.confirm-btn {
					background: #009933;
				}
				.cancel-btn {
					background: #666;
				}
			}
		}
	}
</style>