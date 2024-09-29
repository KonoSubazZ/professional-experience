import ax from '../../utils/request'
export default {
    state: { 
        community: null
    },
    getters: {
        community: state =>{
            return state.community
        }
    },
    mutations:{
        updateCommunity(state,community){
            state.community = community
        }
    },
    actions:{
        getCommunity({commit}){
            ax.get("community").then(it =>{
                commit('updateCommunity',it)
            })       
        }
    }
  }