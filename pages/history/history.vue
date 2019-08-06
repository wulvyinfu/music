<template>
	<view>
		<!-- {{JSON.stringify(history)}} -->
		<!-- <ul>
			<li @click="replay(item)" v-for="(item, i) in history" :key="i">{{item.detail.songs[0].name}}</li>
		</ul> -->
		<uni-list>
			<uni-list-item 
			@click="replay(item,i)" 
			v-for="(item, i) in history" 
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
			...Vuex.mapState(["history","num","historys","playList"])
		},
		methods:{
			...Vuex.mapMutations(["setsrc","getdetail","getlrc"]),
			replay(data,i){
				this.playList = this.history;
				this.setsrc(data.src);
				this.getdetail(data.detail);
				this.getlrc(data.lrc);
				this.num = i;
			}
			// ...Vuex.mapActions(["getsrc"]),
		}
	}
</script>

<style>
</style>
