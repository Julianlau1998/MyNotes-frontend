<template>
    <div id="app">
        <img
            src="../../public/img/settings.png"
            alt="settings"
            v-on:click="settings"
            id=settingsImage
        >
        <span 
            v-touch:swipe="swipeHandler"
        >
        <h1 class="header">
            My<span style="color:rgb(215, 0, 0);">N</span>otes
        </h1>
        <hr class="whiteLine">
        <h2
            v-if="currentComponent=='Notes'"
        >
            <span style="color: rgb(0, 215, 215); opacity: 0.7;">
                {{ $t("text.home.notes") }}
            </span> 
            <span
                @click="changeToLists()"
                style="color: white; cursor: pointer;"
                id="listsButton"
            >
                {{ $t("text.home.lists") }}
            </span>
        </h2>
        <h2 
            v-if="currentComponent=='Lists'"
        >
            <span
                @click="changeToNotes()"
                style="color: white; background: transparent; outline: none; border: none; cursor: pointer;"
                id="notesButton"
            >
                {{ $t("text.home.notes") }}
            </span>
            <span style="color: rgb(0, 215, 215); opacity: 0.7;">
                {{ $t("text.home.lists") }}
            </span>
        </h2>
        <transition
            :name= componentTransitionName 
            mode="out-in"
            ref="componentTransition"
        >
            <Lists
                v-if="currentComponent=='Lists'"
                :lists="storedLists"
                :foldersArray="folders"
            />
            <Notes
                v-else
                :notes="storedNotes"
                :foldersArray="folders"
            />
        </transition>
        <br><br><br><br><br><br>
        </span>
    </div>
</template>

<script>

import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import Notes from '../components/Notes.vue'
import Lists from '../components/Lists.vue'
import { mapState } from 'vuex' 
import axios from 'axios'

Vue.use(Vue2TouchEvents)

export default {
    name: 'Home',
    components: {
        Notes,
        Lists
    },
    data () {
        return {
            currentComponent: this.$store.state.currentComponent,
        }
    },
    computed: {
        ...mapState(['notesModule']),
        ...mapState(['listsModule']),
        ...mapState(['foldersModule']),
        storedLists () {
            if (!this.listsModule.lists.loading && this.listsModule.lists.data !== null) {
                return (!this.listsModule.lists.loading && this.listsModule.lists.data.filter(el => el.folder_id === '' || el.folder_id === '00000000-0000-0000-0000-000000000000')) || []
            }
            return (!this.listsModule.lists.loading && this.listsModule.lists.data) || []
        },
        storedNotes () {
            if (!this.notesModule.notes.loading && this.notesModule.notes.data) {
                (!this.notesModule.notes.loading && this.notesModule.notes.data.filter(el => el.folder_id === '' || el.folder_id === '00000000-0000-0000-0000-000000000000')) || []
                return (!this.notesModule.notes.loading && this.notesModule.notes.data.filter(el => el.folder_id === '' || el.folder_id === '00000000-0000-0000-0000-000000000000')) || []
            }
            return (!this.notesModule.notes.loading && this.notesModule.notes.data) || []
        },
        folders () {
            if (!this.foldersModule.folders.loading && this.foldersModule.folders.data !== null) {
                return (!this.foldersModule.folders.loading && this.foldersModule.folders.data) || []
            } else {
                return (!this.foldersModule.folders.loading && this.foldersModule.folders.data) || []
            }
        },
        componentTransitionName () {
            return this.$store.state.componentTransitionName
        },
        dragging () {
            return this.$store.state.dragging
        }
    },
    methods: {
        swipeHandler (direction) {
            if (
                this.currentComponent === 'Notes' &&
                direction == 'left' &&
                this.dragging === false
                ) { 
                    this.$store.state.componentTransitionName = 'swipe-component-left'
                    this.currentComponent = 'Lists'
                    setTimeout(250)
            } else if (
                this.currentComponent === 'Lists' &&
                 direction == 'right'
                 && this.dragging === false
                 ) {
                this.$store.state.componentTransitionName = 'swipe-component-right'
                this.currentComponent = 'Notes'
                setTimeout(250)
            }
        },
        changeToLists () {
            this.$store.state.componentTransitionName = 'swipe-component-left'
            this.$store.state.currentComponent = 'Lists'
            this.currentComponent = 'Lists'
        },
        changeToNotes () {
            this.$store.state.componentTransitionName = 'swipe-component-right'
            this.$store.state.currentComponent = 'Notes'
            this.currentComponent = 'Notes'
        },
        settings () {
            this.$router.push('/settings')
        }
    },
    created () {
        if( axios.defaults.headers.common['authorization'] === undefined) {
            this.$auth.getTokenSilently()
            .then((token) => {
                this.$store.dispatch('setAuthHeader', token)
                this.$store.dispatch('notesModule/getAll')
                this.$store.dispatch('listsModule/getAll')
                this.$store.dispatch('foldersModule/getAll')
            })
        } else {
            this.$store.dispatch('notesModule/getAll')
            this.$store.dispatch('listsModule/getAll')
            this.$store.dispatch('foldersModule/getAll')
        }

        if (this.currentComponent === null) {
            this.currentComponent = 'Notes'
        }
        localStorage.setItem('currentFolder', '')

        this.$store.state.transitionName = 'fade'
        document.getElementById('body').style.overflow = 'visible'
    }
}
</script>

<style scoped>

body {
    margin: 0;
}
ul {
    list-style-type: none;
}
ul li {
    display: inline-block;
}
.noteDiv {
    overflow-wrap: break-word; 
    width: 9rem;
    height: 8rem;
    border-radius: 1rem;
    background-color: transparent;
    border: none;
    box-shadow: -1px -1px 3px 0px rgb(133, 133, 133),
                1px 1px 4px 2px black;
    margin: 1rem 2rem 2.5rem;
    margin-left: 0rem;
    color: lightgray;
}

.noteDiv:active {
    box-shadow: -1px -1px 3px 0px black,
                1px 1px 3px 0px rgb(133, 133, 133);
}
.noteDiv:focus {
    outline: none;
}
#listParent{
    margin-left: -0.5rem;
}
#listsButton {
    background: transparent;
    border: none;
    outline: none;
}
#listParent {
    min-height: 79vh;
}
   .swipe-component-left-enter-active,
   .swipe-component-left-leave-active {
    transition: transform 0.25s;
  }
  .swipe-component-left-enter {
    transform: translateX(100%);
  }
  .swipe-component-left-enter-to {
    transform: translateX(0%);
  }
  .swipe-component-left-leave {
    transform: translateX(0%);
  }
  .swipe-component-left-leave-to {
    transform: translateX(-100%);
  }

  .swipe-component-right-enter-active,
  .swipe-component-right-leave-active{
    transition: transform 0.25s;
  }
  .swipe-component-right-enter {
    transform: translateX(-100%);
  }
  .swipe-component-right-enter-to {
    transform: translateX(0%);
  } 
  .swipe-component-right-leave {
    transform: translateX(0%);
  }
  .swipe-component-right-leave-to {
    transform: translateX(100%);
  }
@media (max-width: 390px) { 
    .noteDiv {
        width: 7rem;
        height: 7rem;
    }
 }
@media (max-width: 327px) { 
    .noteDiv {
        width: 6rem;
        height: 6rem;
    }
    body {
        margin: 100rem;
    }
 }

@media (min-width: 1000px) { 
    .noteDiv {
        width: 11rem;
        height: 9rem;
    }
 }
 
</style>