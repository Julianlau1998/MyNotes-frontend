<template>
  <div id="wrapper">
        <h2
            class="headerTwo"
            >
            {{folder.title}}
        </h2>
        <ul
            id="listParent"
        >
            <div class="flex">
                <MiniElement
                    :element="list"
                    :isFolder="true"
                    :folderColor="folder.color"
                    v-for="(list, listsIndex) in lists"
                    v-bind:key="list.id + listsIndex"
                    @open="openList($event)"
                />
            </div>
        </ul>
        <div 
            @click="newList()"
            class="plusButton"
            ref="plusButton"
        >
            +
        </div>
  </div>
</template>

<script>
import { mapState } from 'vuex' 
import MiniElement from './MiniElement'
import axios from 'axios'

export default {
    name: 'ListsFolder',
    components: {
        MiniElement
    },
    data () {
        return {
            id: this.$route.params.id
        }
    },
    created () {
        if( axios.defaults.headers.common['authorization'] === undefined) {
            this.$auth.getTokenSilently()
            .then((token) => {
                this.$store.dispatch('setAuthHeader', token)
                let payload = {'userID': this.$auth.user.sub, 'folderID': this.id}
                this.$store.dispatch('listsModule/getByCategory', payload)
                payload = {'userID': this.$auth.user.sub, 'id': this.id}
                this.$store.dispatch('foldersModule/getOne', payload)
            })
        } else {
            let payload = {'userID': this.$auth.user.sub, 'folderID': this.id}
            this.$store.dispatch('listsModule/getByCategory', payload)
            payload = {'userID': this.$auth.user.sub, 'id': this.id}
            this.$store.dispatch('foldersModule/getOne', payload)
        }
        
    },
    computed: {
    ...mapState(['listsModule']),
    ...mapState(['foldersModule']),
        lists () {
            return (!this.listsModule.lists.loading && this.listsModule.lists.data) || []
        },
        folder () {
            return (!this.foldersModule.folder.loading && this.foldersModule.folder.data) || []
        },
    },
    methods: {
        settings () {
            this.$router.push('/settings')
        },
        openList (id) {
            this.$store.state.transitionName = 'swipe-left'
            this.$store.state.id = id
            this.$router.push(`/List/${id}`)
        },
        newList () {
            this.$store.state.transitionName = 'fade'
            localStorage.setItem('currentFolder', this.id)
            this.$router.push('/newList')
        }
    }
}
</script>

<style scoped>
    .headerTwo {
        font-size: 2.2rem;
        color: lightgray;
        margin-top: 1.5rem;
        margin-bottom: 0.8rem;
    }
    ul li {
        display: inline-block !important;
    }
    .delete {
        left: 1rem !important;
        top: 0.5rem !important;
    }
    #settingsImage {
        top: 0.5rem !important;
    }
    .noteDiv {
        outline: none;
    }
    @media (min-width: 1000px) { 
      .noteDiv {
          width: 11rem;
          height: 9rem;
      }
    }
</style>