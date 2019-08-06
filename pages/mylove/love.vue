<template>
	<view>
		<uni-list>
			<uni-list-item 
			@click="play(item)" 
			v-for="(item, i) in aLike" 
			:key="i" 
			:title="item.detail.songs[0].name" 
			:note="item.detail.songs[0].ar[0].name" 
			 show-arrow="false"
			></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import Vuex from 'vuex'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default{
		components: {uniList,uniListItem},
		computed: {
			...Vuex.mapState(["num","aLike"])
		},
		methods:{
			...Vuex.mapMutations(["setsrc","getdetail","getlrc"]),
			play(data){
				this.setsrc(data.src);
				this.getdetail(data.detail);
				this.getlrc(data.lrc);
			}
			// ...Vuex.mapActions(["getsrc"]),
		}
	}
	
</script>

<style>
	
</style>
