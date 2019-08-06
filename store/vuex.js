import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		audio: uni.createInnerAudioContext(),
		detail:{},
		paused:true,
		lrc : '',
		history:[],
		historys:{},
		num: -1,
		mode: 2,
		aLike:[],
		aStar:[],
		currentSrc:'',
		totar:false,
		tolike:false,
		playList:[]
	},
	mutations:{
		setsrc(state, src){
			state.audio.src = src;
			state.audio.play() ;
			state.paused = false ;
			state.currentSrc = src
		},
		getdetail(state,detail){
			state.detail = detail;
			// console.log(state.detail)
		},
		getlrc(state,data){
			state.lrc = data;
			// console.log(88888)
			// console.log(state.lrc)
		},
		next(state){
			if(state.mode===2){
				state.playList.length-1 === state.num ? state.num = 0 : state.num++;
			}else{
				state.num = Math.floor(Math.random()*state.playList.length)
			}
			
			// console.log(state.num)
		},
		pre(state){
			state.num <= 0 ? state.num = state.playList.length-1 : state.num--;
		},
		play(state){
			state.audio.play() ;
			state.paused = false ;
		},
		pause(state){
			state.audio.pause() ;
			state.paused = true ;
		},
		isstar(state){
			state.totar = false ;
			for(let i=0;i<state.aStar.length;i++){
				if(state.aStar[i].detail.songs[0].id === state.detail.songs[0].id){
					state.totar = true;
					break ;
				}
			}
		},
		restar(state){
			for(let i=0,len=state.aStar.length;i<len;i++){
				if(state.aStar[i].detail.songs[0].id === state.detail.songs[0].id){
					delete state.aStar[i];
					state.aStar.sort();
					state.aStar.length = len - 1 ;
					break ;
				}
			
			}
		},
		getstar(state){
			let isre = true;
			for(let i=0;i<state.aStar.length;i++){
				if(state.aStar[i].detail.songs[0].id === state.detail.songs[0].id){
					isre = false ;
					break ;
				}
			}
			if(isre){
				state.aStar.push({
					src:state.currentSrc,
					detail: state.detail,
					lrc: state.lrc
				})
			}
			// console.log(state.aStar)
		},
		islike(state){
			state.tolike = false ;
			for(let i=0;i<state.aLike.length;i++){
				if(state.aLike[i].detail.songs[0].id === state.detail.songs[0].id){
					state.tolike = true;
					break ;
				}
			}
		},
		relike(state){
			for(let i=0,len=state.aLike.length;i<len;i++){
				if(state.aLike[i].detail.songs[0].id === state.detail.songs[0].id){
					delete state.aLike[i];
					state.aLike.sort();
					state.aLike.length = len - 1 ;
					break ;
				}
			
			}
		},
		getlike(state){
			let isre = true;
			for(let i=0;i<state.aLike.length;i++){
				if(state.aLike[i].detail.songs[0].id === state.detail.songs[0].id){
					isre = false ;
					break ;
				}
			}
			if(isre){
				state.aLike.push({
					src:state.currentSrc,
					detail: state.detail,
					lrc: state.lrc
				})
			}
			// console.log(state.aStar)
		},
		gethistory(state,data){
			let isre = true;
			for(let i=0;i<state.history.length;i++){
				if(state.history[i].detail.songs[0].id === data[1].songs[0].id){
					isre = false ;
					break ;
				}

			}
			console.log(111,isre)
			if(isre){
				state.history.push({
					src:data[2],
					detail: data[1],
					lrc: data[0]
				})
				console.log(state.history)
			}
		},
		toggleModul(state){
			state.mode === 3 ? state.mode = 1 : state.mode ++;
			console.log(state.mode)
		},
		changeList(state,data){
			state.playList = data.list;
			state.num = data.index;
		}
	},
	//类全局函数
	actions:{
		
		getsrc({commit, dispatch},item){
			// commit用来执行mutations函数的方法
			// dispatch 用来执行其他函数的方法
			Promise.all([
				new Promise((next,err)=>{
					uni.request({
						url: `http://www.302gzs.top:3555/lyric?id=${item.id}`,
						success: (res) => {
							// console.log(res)
							commit("getlrc",res.data.lrc.lyric)
							next(res.data.lrc.lyric)
						}
					});
				}),
				
				new Promise((next,err)=>{
					uni.request({
						url: `http://www.302gzs.top:3555/song/detail?ids=${item.id}`,
						success: (res)=> {
							console.log(res)
							 commit('getdetail',res.data)
							next(res.data)
						}
					});
				}),
				new Promise((next,err)=>{
					uni.request({
						url: `http://www.302gzs.top:3555/song/url?id=${item.id}`,
						success: (res)=> {
							commit('setsrc',res.data.data[0].url)
							next(res.data.data[0].url)
						}
					});
					
				})
			]).then((data)=>{
				commit("isstar")
				commit("gethistory",data)
			})
		}
	}
})