<template>
	<view>
		<uni-list>
			<uni-list-item 
			@click="replay(item,i)" 
			v-for="(item, i) in s" 
			:key="i" 
			:title="item.filePath" 
			 show-arrow="false"
			></uni-list-item>
		</uni-list>
		<player></player>
	</view>
</template>

<script>
	import Vuex from "vuex"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import player from "@/components/player/player.vue"
	export default{
		components: {uniList,uniListItem},
		computed:{
			...Vuex.mapState(['aStar',"num","playList"])
		},
		data(){
			return{
				s:[]
			}
		},
		mounted(){
			uni.getSavedFileList({
				success:(res)=>{
					this.s = res.fileList
					console.log(JSON.stringify(res.fileList))
				}
			})
		},
		methods:{
			...Vuex.mapMutations(["setsrc","getdetail","getlrc"]),
			replay(data,i){
				var detail = {};
				detail.songs = [{name: data.filePath}];
				this.getdetail(detail)
				this.playList = this.aStar;
				this.setsrc(data.filePath);
			}
		}
	}
</script>

<style>
</style>
