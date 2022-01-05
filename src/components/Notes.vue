<template>
    <div id="app">
        <ul
            id="listParent"
        >
            <!-- <draggable
                :delay="200"
                :delay-on-touch-only="true"
                v-model="storedNotes"
                @start="dragging()"
                @end="save()"
            > -->
                <li
                    v-for="(folder, index) in folders"
                    v-bind:key="folder.id + index"
                >
                    <span v-touch:touchhold="touchHoldHandler">
                        <button
                            class="noteDiv" 
                            v-bind:style="{backgroundColor: folder.color}"
                            @click="openFolder(folder.id)"
                        >
                            <h5><b>
                                {{ folder.title.split(' ')[0].length > 0 ? folder.title.split(' ')[0].substring(0,8) : folder.title.substring(0,8)}}
                            </b></h5>
                        </button>
                    </span>
                    <hr id="redLine">
                </li>
                <li
                    v-for="(note, idx) in storedNotes"
                    v-bind:key="note.id + idx"
                >
                    <span
                        v-touch:touchhold="touchHoldHandler"
                        v-if="note.folder_id === '' || note.folder_id == '00000000-0000-0000-0000-000000000000'"
                    >
                        <button
                            class="noteDiv"
                            @click="openNote(note.id)"
                        >
                            <h5><b>
                                {{ note.title.split(' ')[0].length > 0 ? note.title.split(' ')[0].substring(0,8) : note.title.substring(0,8)}}
                            </b></h5>
                        </button>
                    </span>
                    <hr id="redLine">
                </li>
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
            <span class="x-button"> x </span>
        </div>
        <div 
            class="newFolder"
            v-if="folderChoice"
        >   
            <a
                id="newFolder"
                @click="newFolder()"
            >
                {{ $t("text.home.new_folder") }}
            </a>
        </div>
        <div
            class="newNote"
            v-if="folderChoice"
        >
            <a
                id="newNote"
                @click="newNote()"
            >
                {{ $t("text.home.new_note") }}
            </a>
        </div>
        <transition
            name="new-folder"
        >
            <new-folder 
            v-if="newFolderDiv"
            v-on:send="newFolderDiv = !newFolderDiv"
            @close="close()"
            type="Notes"
        />
        </transition>
    </div>
</template>

<script>
import router from '../router'
import Vue from 'vue'
// import draggable from 'vuedraggable'
import Vue2TouchEvents from 'vue2-touch-events'
import { mapState } from 'vuex' 
import NewFolder from './NewFolder.vue'
import axios from 'axios'

Vue.use(Vue2TouchEvents)

export default {
    name: 'Notes',
    // components: {draggable},
    components: {NewFolder},
    props: {
        notes: {
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
            titles: [],
            sorting: false,
            folderChoice: false,
            newFolderDiv: false,
        }
    },
    created () {
        localStorage.setItem('currentComponent', 'Notes')
    },

    computed: {
    ...mapState(['notesModule']),
    ...mapState(['foldersModule']),
        folders () {
            return this.foldersArray.filter(folder => folder.type ==='Notes')
        },
        storedNotes () {
            return this.notes
        }
    },
    methods: {
        openNote (id) {
            this.$store.state.transitionName = 'swipe-left'
            this.$refs.plusButton.style.opacity = 0
            this.$store.state.id = id
            router.push(`/Note/${id}`)
        },
        openFolder (id) {
            this.$store.state.transitionName = 'fade'
            this.$store.state.id = id
            localStorage.setItem('folder', 'Notes')
            this.$router.push(`/Folder/${id}`)
        },
        swipeHandler () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/lists')
        },
        routeToLists () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/lists')
        },
        newNote () {
            this.$store.state.transitionName = 'fade'
            this.$router.push('/newNote')
        },
        touchHoldHandler () {
            this.sorting = true
        },
        save () {
            this.$store.state.dragging = false
            localStorage.setItem('notes', JSON.stringify(this.storedNotes))
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
        closeFolderChoiceDiv () {
            this.folderChoice=!this.folderChoice
        },
        closeNewFolderDiv () {
            this.newFolderDiv=!this.newFolderDiv
        }
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
#loading {
    margin-top: 3rem;
}
#folder {
    width: 2rem;
    margin-top: -1rem;
}
#newFolderBackground  {
    position: absolute;
    top: -11.3rem;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: black;
    z-index: 0;
    opacity: 0.5;
}
.plusButton {
    z-index: 10;
}

@media (min-width: 1000px) { 
    .noteDiv {
        width: 7rem;
        height: 7rem;
    }
    #listParent {
        width: 80vw;
        margin-left: 10vw;
    }
 }
 @media (min-width: 1500px) { 
    #listParent {
        width: 70vw;
        margin-left: 15vw;
    }
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