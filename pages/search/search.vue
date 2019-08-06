<template>
	<view>
		<view class="uni-title">
			热门搜索
		</view>
		<uni-tag class="uni-tag" 
		@click="hots(item.first)" 
		:text="item.first" 
		:circle="true" v-for="(item, index) in hot" 
		:key="index"></uni-tag>
		<view class="uni-title">
			历史搜索
		</view>
		<uni-tag class="uni-tag" @click="hots(item)" :text="item" :circle="true" v-for="(item, index) in historys" ></uni-tag>
		<uni-list>
			<uni-list-item 
			:title="song.name" 
			:note="song.artists[0].name" 
			v-for="(song, index) in songs"
			:key="index"
			show-arrow="false"
			@click = "getsrc(song)"
			></uni-list-item>
		</uni-list>
		<view class="page-section page-section-gap" style="text-align: center;">
			<!-- <audio style="bottom: 20upx" :src="current.src" controls></audio> -->
		</view>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import Vuex from "vuex"
	export default{
		computed: {
			...Vuex.mapState(["historys","history","playList","num"])
		},
		components: {
			uniTag,
			uniList,
			uniListItem
		},
		data(){
			return {
				hot: [],
				songs: []
			}
		},
		mounted(){
			uni.request({
				url: "http://www.302gzs.top:3555/search/hot",
				success:(res) => { 
					this.hot = res.data.result.hots
				}
			})
		},
		methods:{
			...Vuex.mapActions(["getsrc"]),
			play(a){
				console.log(a)
			},
			start(song){
				getsrc(song)
				this.playSilt = this.history;
				this.num = this.history.length-1;
			},
			hots(text){
				this.historys[text] = text
				uni.request({
					url: `http://www.302gzs.top:3555/search?keywords= ${text}`,
					success: (res)=> {
						// console.log(res.data.result.songs[0])
						this.songs = res.data.result.songs
					}
				})
			}
		},
		onNavigationBarSearchInputConfirmed(e){
			// console.log(e)
			this.hots(e.text)
			
		}
// 		,
// 		onNavigationBarSearchInputChanged(e){
// 			if(e.text)this.hots(e.text)
// 		}
	}
	
</script>

<style>
	.uni-tag{
		margin:15upx;
	}
</style>
