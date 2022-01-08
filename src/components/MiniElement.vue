<template>
<div>
    <div class="flex" v-if="element.folder_id === '' || element.folder_id == '00000000-0000-0000-0000-000000000000' || isFolder">
        <button
            class="noteDiv"
            @click="$emit('open', element.id)"
            v-bind:style="{backgroundColor: isFolder && !folderColor ? element.color : folderColor ? folderColor : ''}"
        >
            <h5>
                <b> {{ element.title.split(' ')[0].length > 0 ? element.title.split(' ')[0].substring(0,8) : element.title.substring(0,8)}} </b>
            </h5>
        </button>
    </div>
    <hr id="redLine">
</div>
</template>

<script>
export default {
    props: {
        element: {
            required: true,
            type: Object
        },
        isFolder: {
            required: false,
            type: Boolean,
            default: false
        },
        folderColor: {
            required: false,
            type: String,
            default: ''
        }
    }
}
</script>

<style>

</style>