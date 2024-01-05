<template>
    <div>
        <div class="w-full bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <slot name="buttons"></slot>
            <span class="font-bold p-2">{{ $t('total') }}: {{ filteredItems.length }}</span>
            <Button @click="prevPage" :disabled="currentPage <= 1" label="previous" :loading-time=100 />
            <span>{{ currentPage }} / {{ pageCount }}</span>
            <Button @click="nextPage" :disabled="currentPage >= pageCount" label="next" :loading-time=100 />
            {{ $t('search') }}：
            <input v-model="searchTerm" :placeholder="$t('enterTips')"
                class=" m-3 p-3 my-2 border-2 border-gray-300 rounded" />
            <template v-if="uniqueGroupNames.length > 0">
                {{ $t('group') }}：
                <select v-model="searchGroup" class=" m-3 p-3 my-2 border-2 border-gray-300 rounded">
                    <option value="">{{ $t('all') }}</option>
                    <option v-for="item in uniqueGroupNames" :key="item.group_name" :value="item.group_name">
                        {{ item.group_name }}
                    </option>
                </select>
            </template>
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
            searchGroup: '',
        }
    },
    computed: {
        uniqueGroupNames() {
            return this.items.reduce((unique, item) => {
                if (item.group_name && !unique.some(obj => obj.group_name === item.group_name)) {
                    unique.push(item);
                }
                return unique;
            }, []).sort((a, b) => a.group_name ? a.group_name.localeCompare(b.group_name) : 0);
        },
        filteredItems() {
            if (this.searchTerm) {
                return this.items.filter(item =>
                    item[this.searchKey].includes(this.searchTerm) &&
                    (!this.searchGroup || item.group_name === this.searchGroup)
                );
            } else {
                return this.items.filter(item =>
                    !this.searchGroup || item.group_name === this.searchGroup
                );
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