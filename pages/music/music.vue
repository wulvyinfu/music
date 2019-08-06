<template>
	<view id="page">
		<view class="img-body">
			<image :class="paused ? 'img': 'img run' " :src="detail.songs[0].al.picUrl"></image>
		</view>
		<view>
			<view class="lyricbody" ><!-- ref="lyr" -->
				<ul :style="'margin-top:'+ index * (-32) +'px'" >
					<li style="vertical-align: middle;" v-for="(lyric, i) in aLrc" :class="index==i?'red':''">
						{{lyric.lyric}} <b style="width: 4upx; height: 45upx;display: inline-block;"></b>
					</li>
				</ul>
				<!-- <ul>
					<li style="vertical-align: middle;" v-for="(lyric, i) in aLrc" :ref="index==i-1?'hei':''" :class="index==i?'red':''">
						{{lyric.lyric}} <b style="width: 4upx; height: 45upx;display: inline-block;"></b>
					</li>
				</ul> -->
			</view>
			<view class="icon-ab">
				<view class="icon"> 
					<cmd-icon @click="toLike" :type="tolike ? 'heart-2':'heart'" size="20" color="#666"></cmd-icon>
				</view>
				<view class="icon"> 
					<cmd-icon @click="tostar" :type="totar ? 'star-2' : 'star' " size="20" color="#666"></cmd-icon>
				</view>
				<view class="icon"> 
					<cmd-icon @click="download" type="download" size="20" color="#666"></cmd-icon>
				</view>
				<view class="icon"> 
					<uni-icon @click="tocomment" type="chatbubble" size="28" color="#666"></uni-icon>
				</view>
				<view class="icon"> 
                <cmd-icon type="share" size="20" color="#666"></cmd-icon>
				</view>
			</view>
			<view class="slideree">
                {{start}}
				<slider @change="change" 
				 @changing="changing" 
				 :value='value' block-size='12'
				  backgroundColor='#888888' />
				{{total}}
            </view>
		</view>
		<view class="icon-bar">
			<view class="icon" @click="toggleModul"> 
				<cmd-icon v-if="mode===3" style="line-height: 1.8;" type="shuffle-play" size="26" color="#654321"></cmd-icon>
				<uni-icon class="uni-icon" style='line-height: 1.8;font-weight: bold;' v-else="" color="#654321" size="26" :type="mode===2?'loop':'reload'" ></uni-icon>
			</view>
			<view class="icon" @click="preSong"> 
				<cmd-icon style="line-height: 1.8;" type="prev" size="26" color="#654321"></cmd-icon>
			</view>
			<view class="icon" @click.stop="paused ? play(): pause()"> 
				<cmd-icon style="line-height: 1.8;" :type="paused ? 'play':'pause'" size="26" color="#654321"></cmd-icon>
			</view>
			<view class="icon" @click.stop="nextSong"> 
				<cmd-icon style="line-height: 1.8;" type="next" size="26" color="#654321"></cmd-icon>
			</view>
			<view class="icon"> 
				<cmd-icon @click="togglState" style="line-height: 1.8;" type="menu" size="26" color="#654321"></cmd-icon>
			</view>
		</view>
		<uni-drawer @close="closeDra" :visible="showStar" mode="right">
			<view style="padding:30upx;">
				<view class="uni-title">我的收藏</view>
				<uni-list>
					<uni-list-item @click="startPlay(song,i)" :title="song.detail.songs[0].name" v-for="(song , i) in aStar" :key="i" show-arrow="false"></uni-list-item>
                </uni-list>
			</view>
		</uni-drawer>
	</view>
</template>
<script>
	import Vuex from 'vuex'
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	import cmdIcon from "@/components/cmd-icon/cmd-icon.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	// import player from "@/components/player/player.vue"
	export default{
		components: {
			uniTag,
			cmdIcon,
			uniIcon,
			uniList,
			uniListItem,
			uniDrawer
			// player
		},
		computed: {
			...Vuex.mapState(["detail","paused",
			"audio","lrc","history","num","mode",
			"aLike","aStar","currentSrc","totar",
			"tolike","playList"])
		},
		data(){
			return {
				start:'',
				total: '',
				value: 0 ,
				updatestate: true,
				aLrc: [],
				index: -1,
				moveState:false,
				star: false,
				heart: false,
				showStar: false,
				scroll: false,
				timeout : {},
				Inter: {}
			}
		},
		mounted() {
// 			this.audio.onEnded(()=>{
// 				this.index = -1;
// 				// this.lrcData();
// 				uni.setNavigationBarTitle({
// 					title: this.detail.songs[0].name
// 				});
// 				this.audio.currentTime = 0 ;
// 				this.updateMic();
// 			});
			// this.$refs.lyr.$el.addEventListener('scroll', this.handleScroll, true)
			this.update();
			this.audio.onPlay(()=>{
				// console.log(this.detail)
				this.update();
			});
			uni.setNavigationBarTitle({
				title: this.detail.songs[0].name
			});
			this.audio.onTimeUpdate(this.jindu);
		},
// 		watch:{
// 			index(){
// 				if(this.scroll)return ;
// 				if(this.$refs.lyr.$el){
// 					let i = 0 ;
// 					const self = this;
// // 					this.$refs.lyr.$el.scrollTop += 25;
// // 					console.log(this.$refs.lyr.$el.scrollTop)
// 					let topH = this.$refs.hei[0].clientHeight;
// 					console.log(topH)
// 					this.move(this.$refs.lyr.$el,1500,this.index * topH )
// 					
// 					
// 				}
// 			}
// 		},
		methods: {
			...Vuex.mapMutations(["play","pause","getdetail","getlrc",
			"setsrc","next","pre","toggleModul","getstar","getlike",
			"isstar","islike","restar","relike","changeList"]),
			...Vuex.mapActions(["getsrc"]),
// 			handleScroll(e){
// 				this.scroll = true;
// 				let self = this;
// 				if(this.timeout.timer)clearTimeout(this.timeout.timer)
// 				this.timeout.timer = setTimeout(function(){
// 					self.scroll = false ;
// 					self.move(self.$refs.lyr.$el,1500,self.index * 28)
// 				},1000)
// 				console.log(1)
// 			},
			tostar(){
				if(!this.totar){
					this.getstar()
				}else{
					this.restar()
				}
				this.isstar()
			},
			update(){
				this.lrcData();
				uni.setNavigationBarTitle({
					title: this.detail.songs[0].name
				});
				this.isstar()
				this.islike()
				this.updateMic();
				console.log(this.index)
			},
// 			move(obj,time,num){
// 				var start = new Date();
// 				var h = obj.scrollTop ;
// 				var _num = num - h;
// 				// console.log(_num)
// 				const self = this;
// 				if(this.Inter.timer)clearInterval(this.Inter.timer);
// 				this.Inter.timer = setInterval(function(){
// 					var now = new Date();
// 					var _time = (now-start)/time ;
// 					self.scroll = false ;
// 					clearTimeout(self.timeout.time)
// 					if(_time > 1){
// 						_time = 1;
// 						clearInterval(self.Inter.timer);
// 					}
// 					obj.scrollTop = parseInt(h) + _num*_time ;
// 				})
// 			},
			init(item){
				uni.request({
					url: `http://www.302gzs.top:3555/lyric?id=${item.id}`,
					success: (res) => {
						// console.log(res)
						const self = this;
						Promise.all([
							new Promise((next,err)=>{
								self.getlrc(res.data.lrc.lyric)
							})
						]).then(()=>{
							self.lrcData();
							self.index = -1;
							self.updateMic();
						})
						
						
					}
				});
				uni.request({
					url: `http://www.302gzs.top:3555/song/detail?ids=${item.id}`,
					success: (res)=> {
						this.getdetail(res.data);
						uni.setNavigationBarTitle({
							title: this.detail.songs[0].name
						});
					}
				});
			},
			toLike(){
				// console.log(2)
				alert('添加成功')
				if(!this.tolike){
					this.getlike()
				}else{
					this.relike()
				}
				this.islike()
			},
			tocomment(){
				uni.navigateTo({
					url:"/pages/comment/comment"
				})
			},
			download(){
				// downloadFile 相当于临时缓存
				uni.downloadFile({
					url: this.audio.src,
					success: (res) => {
						console.log(uni.saveFile)
						if(uni.saveFile){
							// 手机app下载方式 永久保存
							uni.saveFile({
								tempFilePath: res.tempFilePath
							})
						}else{
							// 浏览器下载方式
							var a = document.createElement('a');
							a.href = res.tempFilePath;
							a.download = this.detail.songs[0].name + '.mp3'
							a.click()
						}
					}
				})
			},
			startPlay(data,i){
				this.playList = this.aStar ;
				this.num = i
				this.getsrc(data.detail.songs[0])
				// console.log(data)
			},
			nextSong(){
				this.next()
				this.toggleSong()
				
			},
			toggleHeart(){
				// this.heart ? 
			},
			preSong(){
				this.pre();
				this.toggleSong();
			},
			toggleSong(){
				// console.log(this.playList[this.num])
				let item =  this.playList[this.num] ;
				if(item.detail){
					this.getlrc(item.lrc)
					this.getdetail(item.detail)
					this.setsrc(item.src)
					item = this.playList[this.num].detail.songs[0]
				}else{
// 					console.log(item)
// 					this.getsrc(item)
					uni.request({
						url: `http://www.302gzs.top:3555/song/url?id=${item.id}`,
						success: (res)=> {
							this.setsrc(res.data.data[0].url)
							console.log('ok')
						}
					});
					this.init(item);
				}
				this.pause();
				this.play();
			},
			change(e){
				var t = e.detail.value * this.audio.duration / 100
				this.audio.seek(t)
				this.updatestate = true
				this.updateMic();
				// console.log(this.audio.currentTime)
				
			},
			changing(){
				this.updatestate = false ;
			},
			updateMic(){
				const self = this;
				// 当前播放时间
				let min = Math.floor(this.audio.currentTime / 60);
				min = min.toString().length === 1 ? ("0" + min): min;
				let sec = Math.round(this.audio.currentTime % 60);
				sec = sec.toString().length === 1 ? ("0" + sec): sec;
				// 总时间
				let zmin = Math.floor(this.audio.duration / 60);
				zmin = zmin.toString().length === 1 ? ("0" + zmin): zmin;
				let zsec = Math.round(this.audio.duration % 60);
				zsec = zsec.toString().length === 1 ? ("0" + zsec): zsec;
				
				self.start = `${min}:${sec}`
				this.total = `${zmin}:${zsec}`
				this.index = 0;
				d()
				function d(){
					self.index++;
					if(self.aLrc[self.index+1] && self.start > self.aLrc[self.index+1].time ){
						d()
					}
				}
			},
			lrcData(){
				// console.log(this.lrc)
				let soonArr = this.lrc.split("\n");
				// console.log(soonArr)
				this.aLrc = [];
				for(let i=0,len = soonArr.length;i<len;i++){
					let json = {};
					let arr = soonArr[i].substring(1,soonArr[i].length).split("]");
					let content = '';
					for(let j=1;j<arr.length;j++){
						content += arr[j];
					}
					json.time = arr[0];
					json.lyric = content;
					this.aLrc.push(json);
				}
				this.len = this.aLrc.length;
				// console.log(this.aLrc)
			},
			jindu(){
				// 当前播放时间
				let min = Math.floor(this.audio.currentTime / 60);
				min = min.toString().length === 1 ? ("0" + min): min;
				let sec = Math.round(this.audio.currentTime % 60);
				sec = sec.toString().length === 1 ? ("0" + sec): sec;
				// 总时间
				let zmin = Math.floor(this.audio.duration / 60);
				zmin = zmin.toString().length === 1 ? ("0" + zmin): zmin;
				let zsec = Math.round(this.audio.duration % 60);
				zsec = zsec.toString().length === 1 ? ("0" + zsec): zsec;
				
				this.start = `${min}:${sec}`
				this.total = `${zmin}:${zsec}`
				if(this.updatestate){
					this.value = this.audio.currentTime / this.audio.duration *100
				}
				if(this.index === this.aLrc.length-1) return;
				// console.log(this.aLrc[this.index+1])
				if(this.aLrc[this.index+1].time < this.start){
					this.index++;
					// console.log(this.index)
				}
// 				if(this.$refs.lyr.$el){
// 					
// 					setInterval(function(){
// 						this.$refs.lyr.$el.scrollTop++ ;
// 					})
// 				}
			},
			togglState(){
				this.showStar = true ;
			},
			closeDra(){
				this.showStar = false ;
			}
		}
	}
</script>

<style>
	#page .img-body{
		width: 550upx;
		margin: auto;
		text-align: center;
		padding: 40upx 0;
	}
	#page .img-body .img{
		width: 300upx;
		height: 300upx;
		border-radius: 50%;
		border:75upx solid #000000;
		animation: run 10s linear infinite; 
		animation-play-state:paused;
		-webkit-animation-play-state:paused; /* Safari 和 Chrome */
	}
	#page .img-body .run{
		animation-play-state:running;
		-webkit-animation-play-state:running;
		animation-fill-mode: forwards;
	}
	.slideree{
		display: flex;
		padding-left: 40upx;
		line-height: 2.5;
	}
	.slideree slider{
		width: 60%;
		display: inline-block;
	}
	.lyricbody{
		height:50upx;
		padding: 150upx 0;
		overflow: hidden;
	}
	ul{
		transition: margin 1.5s;
		list-style: none;
		text-align: center;
		padding: 20upx;
		margin: 0;
	}
	ul li{
		/* height: 54upx; */
		font-size: 42upx;
		height: 32px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	ul .red{
		/* height: 60upx;
		line-height: 60upx; */
		color: red;
		font-size: 40upx;
		height:auto;
		text-overflow:clip;
		white-space:normal;
		overflow: visible;
	}
	#page .icon-ab{
		padding: 20upx 0 0 40px;
	}
	#page .icon-ab .icon{
		display: inline-block;
		margin-right: 70upx;
	}
	#page .icon-bar {
		display: flex;
		padding:0 40px;
		justify-content: space-between;
	}
	
	@keyframes run
	{
	0%   {transform:rotate(0deg);}
	100% {transform:rotate(360deg);}
	}
	
</style>
