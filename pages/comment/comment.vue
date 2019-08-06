<template>
	<view style="padding: 20upx;">
		<view class="user-view" v-for="(item, i) in comments" :key="i">
			<view class="title">
				<image class="user-image" :src="item.user.avatarUrl" height=100 width=100></image><span>{{item.user.nickname}}</span>
			</view>
			<view style="padding: 30upx;">{{item.content}}</view>
		</view>
	</view>
</template>

<script>
	import Vuex from "vuex"
	export default{
		computed:{
			...Vuex.mapState(["detail"])
		},
		data(){
			return {
				comments:[]
			}
		},
		mounted() {
			uni.request({
				url:`http://www.302gzs.top:3555/comment/music?id=${this.detail.songs[0].id}`,
				success: (res) => {
					this.comments = res.data.comments;
					console.log(this.comments)
				}
			})
		}
	}
</script>

<style>
	.user-view{
		padding: 20upx;
		border-bottom: 1upx solid #ccc;
	}
	.title{
		vertical-align: middle;
	}
	.user-image{
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		vertical-align: middle;
	}
	span{
		display:inline-block;
		margin-left:20upx ;
	}
</style>
