<template>
    <div class="w-full">
        <Pagination :items="analytics" :searchKeys="[ 'username', 'day_hour', 'device_index']" @refresh="get_analytics">
            <template v-slot:buttons>
            </template>
            <template v-slot:default="slotProps">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('id') }}</th>
                                <th>{{ $t('username') }}</th>
                                <th>{{ $t('day_hour') }}</th>
                                <th>{{ $t('follower_count') }}</th>
                                <th>{{ $t('video_count') }}</th>
                                <th>{{ $t('video_collect_count') }}</th>
                                <th>{{ $t('video_comment_count') }}</th>
                                <th>{{ $t('video_like_count') }}</th>
                                <th>{{ $t('video_play_count') }}</th>
                                <!-- <th>{{ $t('actions') }}</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in slotProps.items" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.username }}</td>
                                <td>{{ item.day_hour }}</td>
                                <td>
                                    <div class="stat-value text-primary">{{ item.follower_count }}</div>
                                    <div class="stat-desc text-primary">{{ item.follower_count_up }}</div>
                                </td>
                                <td>
                                    <div class="stat-value text-secondary">{{ item.video_count }}</div>
                                    <div class="stat-desc text-secondary">{{ item.video_count_up }}</div>
                                </td>
                                <td>
                                    <div class="stat-value text-primary">{{ item.video_collect_count }}</div>
                                    <div class="stat-desc text-primary">{{ item.video_collect_count_up }}</div>
                                </td>
                                <td>
                                    <div class="stat-value text-secondary">{{ item.video_comment_count }}</div>
                                    <div class="stat-desc text-secondary">{{ item.video_comment_count_up }}</div>
                                </td>
                                <td>
                                    <div class="stat-value text-primary">{{ item.video_like_count }}</div>
                                    <div class="stat-desc text-primary">{{ item.video_like_count_up }}</div>
                                </td>
                                <td>
                                    <div class="stat-value text-secondary">{{ item.video_play_count }}</div>
                                    <div class="stat-desc text-secondary">{{ item.video_play_count_up }}</div>
                                </td>

                                <!-- <td>
                                    <div class="space-x-4">
                                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            @click="editAnalytics(item)">{{ $t('edit') }}</button>
                                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            @click="deleteAnalytics(item)">{{ $t('delete') }}</button>
                                    </div>
                                </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </Pagination>
    </div>
</template>
<script>
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import Pagination from '../Pagination.vue'
export default {
    name: 'app',
    components: {
        Modal,
        Button,
        Pagination,
    },
    data() {
        return {
            analytics: [],
            currentAnalytics: null,
            showAddAnalytics: false,
        }
    },
    methods: {
        get_analytics() {
            this.currentAnalytics = null
            this.$service.get_analytics().then(res => {
                this.analytics = res.data
                this.analytics.forEach((item, index) => {
                    if (index < this.analytics.length - 1) {
                        item.follower_count_up = Math.max(0, item.follower_count - this.analytics[index + 1].follower_count);
                        item.video_count_up = Math.max(0, item.video_count - this.analytics[index + 1].video_count);
                        item.video_collect_count_up = Math.max(0, item.video_collect_count - this.analytics[index + 1].video_collect_count);
                        item.video_comment_count_up = Math.max(0, item.video_comment_count - this.analytics[index + 1].video_comment_count);
                        item.video_like_count_up = Math.max(0, item.video_like_count - this.analytics[index + 1].video_like_count);
                        item.video_play_count_up = Math.max(0, item.video_play_count - this.analytics[index + 1].video_play_count);
                    } else {
                        item.follower_count_up = 0
                        item.video_count_up = 0
                        item.video_collect_count_up = 0
                        item.video_comment_count_up = 0
                        item.video_like_count_up = 0
                        item.video_play_count_up = 0
                    }
                    item.follower_count_up =`↗︎ ${item.follower_count_up} (${(item.follower_count_up / item.follower_count * 100).toFixed(0)}%)`
                    item.video_count_up =`↗︎ ${item.video_count_up} (${(item.video_count_up / item.video_count * 100).toFixed(0)}%)`
                    item.video_collect_count_up =`↗︎ ${item.video_collect_count_up} (${(item.video_collect_count_up / item.video_collect_count * 100).toFixed(0)}%)`
                    item.video_comment_count_up =`↗︎ ${item.video_comment_count_up} (${(item.video_comment_count_up / item.video_comment_count * 100).toFixed(0)}%)`
                    item.video_like_count_up =`↗︎ ${item.video_like_count_up} (${(item.video_like_count_up / item.video_like_count * 100).toFixed(0)}%)`
                    item.video_play_count_up =`↗︎ ${item.video_play_count_up} (${(item.video_play_count_up / item.video_play_count * 100).toFixed(0)}%)`
                })
            }).catch(err => {
                console.log(err)
            })
        },
        
       
    },
    mounted() {
        this.get_analytics();

    }

}
</script>
