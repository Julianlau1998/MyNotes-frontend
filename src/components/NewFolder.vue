<template>
    <div>
    <div 
        class="wrapper"
        @click="close()"
    >
    </div>
        <div
            class="newFolderDiv"
        >
            <h2>
                {{ $t("text.home.new_folder") }}
            </h2>
            <hr class="whiteLine">
            <br>
            <ValidationObserver v-slot="{ invalid }">
                <form @submit.prevent="onSubmit">
                    <ValidationProvider name="name" rules="required">
                        <input
                            type="text" 
                            :placeholder="$t('text.home.new_folder')"
                            class="neomorph"
                            id="folderInput"
                            v-model="newFolderObject.title"
                            autocomplete="off"
                            autofocus
                        >
                        <br>
                    </ValidationProvider>
                    <br>
                    <select 
                        name="color" 
                        id="colorSelect"
                        class="neomorph"
                        v-model="newFolderObject.color"
                    >
                        <option disabled selected>Color</option>
                        <option value="Red">Red</option>
                        <option value="Green">Green</option>
                        <option value="Blue">Blue</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Gray">Gray</option>
                    </select>
                    <button
                        type="submit"
                        class="saveButton"
                        :disabled="invalid"
                    >
                        Save
                    </button>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
    name: 'NewFolder',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data () {
        return {
            newFolderObject: {
                id: '',
                user_id: '',
                title: '',
                color: 'Color',
                type: ''
            }
        }
    },
    props: ['type'],
    methods: {
        onSubmit (error) {
            if (error === undefined) {
                if(this.notesList===null) {
                    this.notesList = []
                }
            }
            this.newFolderObject.userID = this.$auth.user.sub
            this.newFolderObject.type = this.type
            this.newFolderObject.color = this.getColor(this.newFolderObject.color)
            const payload = {'folder': this.newFolderObject,'userID': this.$auth.user.sub}
            this.$store.dispatch('foldersModule/post', payload)
                .then(() => {
                    this.$store.dispatch('foldersModule/getAll')  
                    this.save = true
                    this.$emit('send')
                })
                .catch ((err) => {
                    console.log(err)
                    this.$emit('send')
                })
        },
        close () {
            this.$emit('close')
        },
        getColor (color) {
            switch (color) {
                case "Red":
                    return "#C0392B"
                case "Green":
                    return "#196F3D"
                case "Yellow":
                    return "#9A7D0A"
                case "Blue":
                    return "#1F618D"
                case "Gray":
                    return "#424949"
                default:
                    return '#7B7D7D'
            }
        }
    }
}
</script>

<style scoped>
    .newFolderDiv {
        width: 23rem;
        height: 20rem;
        padding: 1.5rem 0 1.5rem 0;
        background-color: aliceblue;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #16232e;
        border: none;
        box-shadow: -1px -1px 4px 0px rgb(133, 133, 133),
                    1px 1px 5px 2px black;
        color: lightgray;
        border-radius: 20px;
        z-index: 10;
    }
    #folderInput,
    #colorSelect {
        background: transparent !important;
        width: 80%;
        height: 2.3rem;
        margin-top: -5rem;
        outline: none;
        padding-left: 0.5rem;
        border: 1px solid rgb(125, 125, 125);
        border-radius: 10px;
    }
    #colorSelect {
        margin-top: 0.5rem;
    }

    .whiteLine {
        margin-top: 0.5rem;
    }

    .saveButton {
        width: 6rem;
        height: 2.5rem;
        margin-top: -0.5rem !important;
        bottom: 2.3rem;
        cursor: pointer;
    }
    .wrapper {
        width: 100vw;
        height: 150vh;
        background-color: transparent;
        position: absolute;
        top: -12rem;
        left: 0;
        background-color: black;
        z-index: 10;
        opacity: 0.5;
    }
    @media (max-width: 379px) {
        .newFolderDiv {
            width: 20rem;
        }
    }
    @media (max-width: 325px) {
        .newFolderDiv {
            width: 16rem;
        }
    }
</style>