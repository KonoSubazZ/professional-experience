
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({

    state: {
      count: 0,
      meta:[],
      data:['123'],
      subIndex:''
    },
    getters:{
      getMeta:state=>{
          return state.meta
      },
      getData:state=>{
        return state.data
    },
      getIndex:state=>{
        return state.subIndex
    },
  },
    mutations: {
      increment (state) {
        state.count++
      },
      saveIndex:(state,value)=>{
        state.subIndex = value
        // // console.log(value)
        // // console.log(state.subIndex)
      },
      saveData:(state,value)=>{
        state.data = value
        // // console.log(value)
        // // console.log(state.subIndex)
      },
      saveMeta:(state,value)=>{
       state.meta[value.name] = value.value
    }
    }
  })

