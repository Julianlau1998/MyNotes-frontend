<template>
    <div id="app">
        <ul 
            id="listParent"
        >
            <!-- <draggable
                :delay="200"
                :delay-on-touch-only="true"
                v-model="storedLists"
                @start="dragging()"
                @end="save()"
            > -->
            <div class="flex">
                <MiniElement
                    :element="folder"
                    :isFolder="true"
                    v-for="(folder, folderIndex) in folders"
                    :key="folder.id + folderIndex"
                    @open="openFolder($event)"
                />
            </div>
                <div class="flex">
                    <MiniElement
                        :element="list"
                        v-for="(list, listsIndex) in storedLists"
                        v-bind:key="list.id + listsIndex"
                        @open="openList($event)"
                    />
                </div>
            <!-- </draggable> -->
        </ul>
        <!-- <h3 v-else id="loading">
            Loading...
        </h3> -->
       <div 
            v-if="!folderChoice"
            @click="folderChoice = !folderChoice"
            class="plusButton"
            ref="plusButton"
        >
            +
        </div>
        <div 
            v-else
            @click="folderChoice = !folderChoice"
            class="plusButton"
            ref="plusButton"
        >
            x
        </div>
        <div 
            id="newFolder"
            v-if="folderChoice"
        >   
            <a
                @click="newFolder()"
            >
                {{ $t("text.home.new_folder") }}
            </a>
        </div>
        <div
            id="newNote"
            v-if="folderChoice"
        >
            <a
                @click="newList()"
            >
                {{ $t("text.home.new_list") }}
            </a>
        </div>
        <new-folder 
            v-if="newFolderDiv"
            @close="close()"
            @send="newFolderDiv = !newFolderDiv"
            type="Lists" 
        />
    </div>
</template>

<script>
import router from '../router'
// import draggable from 'vuedraggable'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import { mapState } from 'vuex' 
import NewFolder from './NewFolder.vue'
import MiniElement from './MiniElement.vue'
import axios from 'axios'

Vue.use(Vue2TouchEvents)

export default {
    name: 'Lists',
    // components: {draggable},
    components: {
        NewFolder,
        MiniElement
    },
    props: {
        lists: {
            required: true,
            type: Array
        },
        foldersArray: {
            required: true,
            type: Array
        }
    },
    data () {
        return {
            sorting: false,
            folderChoice: false,
            newFolderDiv: false,
        }
    },
    created () {
        localStorage.setItem('currentComponent', 'Notes')
    },
    computed: {
    ...mapState(['listsModule']),
    ...mapState(['foldersModule']),
        folders () {
            return this.foldersArray.filter(folder => folder.type ==='Lists')
        },
        storedLists () {
            return this.lists
        }
    },
    methods: {
        openList (id) {
            this.$store.state.transitionName = 'swipe-left'
            this.$store.state.id = id
            router.push(`/list/${id}`)
        },
        openFolder (id) {
            this.$store.state.transitionName = 'fade'
            this.$store.state.id = id
            localStorage.setItem('folder', 'Lists')
            this.$router.push(`/Folder/${id}`)
        },
        swipeHandler () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/')
        },
        routeToNotes () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/')
        },
        newList () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/newList')
        },
        touchHoldHandler () {
            this.sorting = true
        },
         save () {
            this.$store.state.dragging = false
            localStorage.setItem('lists', JSON.stringify(this.storedLists))
        },
        dragging () {
            this.$store.state.dragging = true
        },
        newFolder () {
            this.newFolderDiv=true 
            this.folderChoice=false
            this.newFolderDiv = true
        },
        close () {
            this.folderChoice = !this.folderChoice
            this.newFolderDiv=false
        },
    },
    mounted () {
        if(this.storedLists === null) {
            this.storedLists = []
        } 
        localStorage.setItem('currentComponent', 'Lists')
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
    box-shadow: -1px -1px 4px 0px rgb(133, 133, 133),
                1px 1px 5px 2px black;
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
.header {
    font-size: 3.5rem;
    color: lightgray;
}
.whiteLine{
    border-top: 3px solid rgb(134, 134, 134);
    width: 12.5rem;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
}
#whiteLine{
    border-top: 3px solid rgb(134, 134, 134);
    margin-top: -0.5rem;
    margin-bottom: 1rem;
    margin-left: -2.5rem;
}
#notesButton {
    background: transparent;
    border: none;
    outline: none;
}
#listParent {
    min-height: 79vh;
}
#loading {
    margin-top: 3rem;
}
@media (max-width: 390px) { 
    .noteDiv {
        width: 8rem;
        height: 7rem;
    }
 }
@media (max-width: 327px) { 
    .noteDiv {
        width: 8rem;
        height: 7rem;
    }
 }

@media (min-width: 1000px) { 
    .noteDiv {
        width: 11rem;
        height: 9rem;
    }
 }
</style>