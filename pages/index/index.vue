<template>
	<view class="content">
        <!-- <image class="logo" src="/static/logo.png"></image> -->
		<swiper style="text-align: center;" autoplay="true" indicator-dots="true" circular="true">
			<swiper-item v-for="(val,index) in banner" :key="index" >
				<image :src="val.imageUrl" mode="widthFix" ></image>
			</swiper-item>
        </swiper>
		<view class="uni-title" >
		    热门歌曲
		</view>
		<view class="uni-product-list">
			<view @click="gotodetail(item.id)" class="uni-product" v-for="(item, index) in list" :key="index" >
				<view class="image-view">
					<image class="uni-product-image" :src="item.picUrl"></image>
				</view>
				<view class="uni-product-title">{{ item.name }} </view>
			</view>
		</view>
		<uni-drawer @close="closeDrader" mode="left" :visible="show">
			<view style="padding:30upx;">
				<view class="uni-title">管理中心</view>
				<uni-list>
					<uni-list-item @click="gotohistory" title="历史记录" show-arrow="false"></uni-list-item>
					<uni-list-item @click="down" title="下载管理" show-arrow="false"></uni-list-item>
					<uni-list-item @click="gotoLove" title="我的歌曲" show-arrow="false"></uni-list-item>
					<uni-list-item @click="gotostar" title="我的收藏" show-arrow="false"></uni-list-item>
                </uni-list>
			</view>
		</uni-drawer>
		<player></player>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import player from "@/components/player/player.vue"
	
	export default {
		components: {
			uniDrawer,
			uniList,
			uniListItem,
			player
		},
		data() {
			return {
				 banner: [],
				 list: [],
				 show: false
			}
		},
		onLoad() {
			uni.request({
				url: "http://302gzs.top:3555/banner",
				success:(res) => {
					this.banner = res.data.banners
					// console.log(res)
				}
			}),
			uni.request({
				url: "http://302gzs.top:3555/personalized",
				success:(res) => {
					this.list = res.data.result ;
					console.log(res)
				}
			})
		},
		methods: {
			0(){
				this.show = true;
				console.log("这里是菜单按钮")
			},
			1(){
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			down(){
				uni.navigateTo({
					url: '/pages/download/download'
				})
			},
			gotohistory(){
				uni.navigateTo({
					url: '/pages/history/history'
				})
			},
			gotodetail(id){
				uni.navigateTo({
					url: `/pages/detail/detail?sheetId=${id}`
				})
			},
			gotoLove(){
				uni.navigateTo({
					url: '/pages/mylove/love'
				})
			},
			gotostar(){
				uni.navigateTo({
					url: '/pages/collection/collection'
				})
			},
			closeDrader(){
				this.show = false;
			}
		},
		onNavigationBarButtonTap(e){
			this[e.index]()
		}
		
	}
</script>

<style>
	
	
</style>
