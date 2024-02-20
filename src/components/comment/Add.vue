<template>
    <div class="flex flex-col items-start p-4">

        <div class="flex flex-row items-center gap-2 mb-2 w-full">
            <textarea class="textarea textarea-success w-full max-w-xs" placeholder="input formated comments"
                autocomplete="off" v-model="post_comment_topic.content">
            </textarea>
            <label class="input input-bordered flex items-center gap-2">
                <span class=" text-primary">AccountCount: </span>
                <input type="number" class="grow" placeholder="account count" v-model="post_comment_topic.account_count"
                    readonly />
            </label>
            <!-- gen comments btn -->
            <Button class="btn-primary" @click="genComments" label="parse" />
            <Button class="btn-primary" @click="add" label="save" />
        </div>
        <div class="divider">comments</div>
        <!-- comments -->
        <div class="w-full items-center gap-2 mb-2">
            <div class="chat chat-start" v-for="comment in post_comment_topic.comments" :key="comment.no">
                <div class="chat-image avatar">
                    <div class="w-14 h-14 rounded-full border-2 border-green-500 text-center bg-blue-400">
                        <img src="/tx.png" alt="avatar" class="rounded-full" />
                    </div>
                </div>
                <div class="chat-header">
                    #{{ comment.no }}:
                    <span class=" text-primary"> {{ comment.account_id }} {{ comment.parent_no ? 'Reply#' +
                        comment.parent_no
                        : 'Comment' }}</span>
                </div>
                <div class="chat-bubble">{{ comment.content }}</div>
            </div>

        </div>


    </div>
</template>

<script>
import Button from '../Button.vue'
export default {
    props: {
        post_comment: {
            type: Object,
            required: true,

        },

    },

    components: {
        Button
    },
    data() {
        return {
            post_comment_topic: {

                content: '',
                account_count: 0,
                comments: []
            }
        };
    },
    emits: ['add'],
    methods: {
        add() {
            this.$emit('add', this.post_comment_topic);
        },
        genComments() {
            //filter empty lines
            this.post_comment_topic.content = this.post_comment_topic.content.split('\n').filter(Boolean).join('\n')
            //split by line and add to comments
            this.account_count = 0
            var account_ids = []
            this.post_comment_topic.comments = this.post_comment_topic.content.split('\n').map((comment, index) => {
                //fileter head and tail space
                comment = comment.replace(/^\s+|\s+$/g, '')
                var no = index + 1
                var parent_no = null
                var account_id = comment.split(':')[0].split(' ')[0]
                if (!account_ids.includes(account_id)) {
                    account_ids.push(account_id)
                }
                if (comment.includes('(replying to')) {
                    parent_no = no - 1
                }
                //remove head and tail 
                var content = comment.split(':')[1].replace(/^\s+|\s+$/g, '').replace(/^"|"$/g, '')

                return {
                    no: index + 1,
                    content: content,
                    account_id: account_id,
                    parent_no: parent_no
                }
            })
            this.post_comment_topic.account_count = account_ids.length
        }
    },
    mounted() {

    }
};
</script>