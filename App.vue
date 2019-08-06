<script>
	import Vuex from 'vuex'
	export default {
		onLaunch: function () {
			console.log('App Launch')
			this.audio.onEnded(() =>{
				const self = this;
				function endPlay(){
					console.log(self.playList)
					let item =  self.playList[self.num] ;
					if(item.detail){
						self.getlrc(item.lrc)
						self.getdetail(item.detail)
						self.setsrc(item.src)
						item = self.playList[self.num].detail.songs[0]
					}else{
						console.log(item) 
						self.getsrc(item)
					}
				}
				if(this.mode === 1){
					this.play()
				}else{
					
					this.next()
					endPlay()
// 					this.setsrc(this.playList[this.num].src)
// 					this.getdetail(this.playList[this.num].detail)
// 					this.getlrc(this.playList[this.num].lrc)
					
					
				}
			})
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
		computed:{
			...Vuex.mapState(['audio','mode','num','history','playList'])
		},
		methods:{
			...Vuex.mapMutations(['play','getlrc','getdetail','setsrc','next']),
			...Vuex.mapActions(["getsrc"]) 
		}
	}
</script>

<style>
	@import './common/uni.css' ;
	.uni-title {
		font-size: 36upx;
		padding: 10upx;
		font-weight:bold;
	}
	
	/*每个页面公共css */
</style>
