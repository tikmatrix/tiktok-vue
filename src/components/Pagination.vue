<template>
    <div>
        <div class="w-full bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <slot name="buttons"></slot>
            <p class="font-bold p-2">{{ $t('total') }}: {{ filteredItems.length }}</p>
            <Button @click="prevPage" :disabled="currentPage <= 1" label="previous" :loading-time=100 />
            <span>{{ currentPage }} / {{ pageCount }}</span>
            <Button @click="nextPage" :disabled="currentPage >= pageCount" label="next" :loading-time=100 />
            <input v-model="searchTerm" :placeholder="$t('enterTips')"
                class=" m-3 p-3 my-2 border-2 border-gray-300 rounded" />
        </div>
        <slot :items="paginatedItems"></slot>
    </div>
</template>


<script>
import Button from './Button.vue'

export default {
    components: {
        Button,
    },
    props: {
        items: {
            type: Array,
            required: true
        },
        pageSize: {
            type: Number,
            default: 5
        },
        searchKey: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentPage: 1,
            searchTerm: '',
        }
    },
    computed: {
        filteredItems() {
            if (this.searchTerm) {
                return this.items.filter(item => item[this.searchKey].includes(this.searchTerm));
            } else {
                return this.items;
            }
        },
        pageCount() {
            return Math.ceil(this.filteredItems.length / this.pageSize);
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredItems.slice(start, end);
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.pageCount) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    },
}
</script>