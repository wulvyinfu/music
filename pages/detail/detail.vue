<template>
	<view style="background: #ccc;">
		<view class="header">
			<view>
				<image :src="data.playlist.coverImgUrl"></image>
			</view>
			<view style="vertical-align: top;color: #fff;">
				<h3>{{data.playlist.name}}</h3>
				<p style="display: block; padding: 20upx 0;font-size: 24upx ;color: 666;">
					{{data.playlist.creator.nickname}} &gt;
				</p>
				<p style="font-size: 24upx ;color: 666;">介绍：无</p>
			</view>
		</view>
		<ul>
			<li @click="startplay(item,i)" v-for="(item, i) in data.playlist.tracks ">
				<span>{{i+1}}</span> 
				<view style="vertical-align: middle;display: inline-block;">
					<h3>{{item.name}}</h3>
					<p style="font-size: 10upx ;color: #999;">{{item.ar[0].name}}</p>
				</view>
			</li>
		</ul>
		<player></player>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import player from "@/components/player/player.vue"
	export default{
		computed:{
			...Vuex.mapState(["playList","num"])
		},
		components: {
			player
		},
		data(){
			return{
				data:{},
				tracks:[]
			}
		},
		onLoad(res) {
			uni.request({
				url: `http://www.302gzs.top:3555/playlist/detail?id=${res.sheetId}`,
				success: (res) => {
					this.data = res.data;
					// console.log(this.data)
				}
			})
		},
		methods:{
			...Vuex.mapMutations(["changeList"]),
			...Vuex.mapActions(["getsrc"]),
			startplay(item,i){
				this.getsrc(item)
				let json = {};
				json.list = this.data.playlist.tracks;
				json.index = i;
				this.changeList(json)
				console.log(this.num,this.playList)
			}
		}
		
	}
</script>

<style>
	.header{
		padding:40upx;
		background-color: #ccc;
	}
	.header view {
		display: inline-block;
		width: 50%;
		/* vertical-align: top; */
	}
	image{
		width:300upx;
		height: 300upx;
		border-radius: 20upx;
		vertical-align: bottom;
	}
	ul{
		padding: 40upx 20upx;
		border-radius: 20upx 20upx 0 0;
		list-style: none;
		background-color: #fff;
	}
	li{
		padding: 20upx;
		display: flex;
		vertical-align: middle;
	}
	span{
		display: inline-block;
		padding-right: 40upx;
		color: #888;
		font-size: 40upx;
	}
	h3{
		font-weight: normal;
	}
</style>
