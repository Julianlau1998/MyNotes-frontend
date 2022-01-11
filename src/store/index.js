import Vue from 'vue'
import Vuex from 'vuex'
import notesModule from './notesModule'
import listsModule from './listsModule'
import foldersModule from './foldersModule'
import axios from 'axios'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: 0,
    userID: '',
    transitionName: 'swipe-left',
    componentTransitionName: 'component-swipe-left',
    currentComponent: localStorage.getItem('currentComponent'),
    currentFolder: '',
    dragging: false,
    iOS: false,
    localhost: 'https://api.app-mynotes.com/api/',
    //localhost: '/api/',
    folder: ''
  },
  mutations: {
  },
  actions: {
    setAuthHeader(commit, token) {
      axios.defaults.headers.common['authorization'] = `bearer ${token}`
    }
  },
  modules: {
    notesModule,
    listsModule,
    foldersModule
  }
})