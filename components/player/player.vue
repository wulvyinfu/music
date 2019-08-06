<template>
	<view>
		<view @click="gotomusic" class="view-body" v-if="detail.songs">
			<view style="padding: 20upx;" class="img">
				<view>
					<image :src="detail.songs[0].al.picUrl"></image>
				</view>
				<view class="name">
					<p>{{ detail.songs[0].name }}</p>
					<p>{{ detail.songs[0].ar[0].name }}</p>
				</view>
				<view class="icon" @click.stop="paused ? play(): pause()"> 
					<cmd-icon style="line-height: 1.8;" :type="paused ? 'play':'pause'" size="30" color="#654321"></cmd-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Vuex from 'vuex'
	import cmdIcon from "@/components/cmd-icon/cmd-icon.vue"
	export default{
		components: {cmdIcon},
		computed: {
			...Vuex.mapState(["detail","paused"])
		},
		methods: {
			...Vuex.mapMutations(["play","pause"]),
			gotomusic(){
				uni.navigateTo({
					url:"/pages/music/music"
				})
			}
		}
	}
</script>

<style>
	.view-body{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: rgba(255,255,255,.9);
	}
	.view-body image{
		width: 90upx;
		height:90upx;
		border-radius: 50%;
		display: block;
	}
	.name{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 400upx;
	}
	.img view{
		display: inline-block;
		margin-left: 20upx ;
		vertical-align: middle; 
	}
	.view-body .icon{
		float: right;
		margin-right: 40upx;
	}
</style>
