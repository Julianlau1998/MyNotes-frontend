import Vue from 'vue'
import Vuex from 'vuex'
import notesModule from './notesModule'
import listsModule from './listsModule'
import foldersModule from './foldersModule'


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
    //localhost: 'https://api.app-mynotes.com/api/',
    localhost: 'https://mynotes-service-f7xxtlrmbq-ez.a.run.app/api/',
    //localhost: '/api/',
    folder: ''
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    notesModule,
    listsModule,
    foldersModule
  }
})