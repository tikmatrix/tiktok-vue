<template>
    <div>

        <div role="alert" class="alert alert-warning" v-show="showDemoTip">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-bold">{{ $t('demoTip', { email: 'admin@niostack.com' }) }}</span>
            <a class="link link-primary" href="https://t.me/+iGhozoBfAbI5YmE1">Join Telegram Group</a>
        </div>
        <div class="w-full bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <slot name="buttons"></slot>
            <span class="font-bold p-2">{{ $t('total') }}: {{ filteredItems.length }}</span>
            <Button @click="prevPage" :disabled="currentPage <= 1" label="previous" :loading-time=100 />
            <span>{{ currentPage }} / {{ pageCount }}</span>
            <Button @click="nextPage" :disabled="currentPage >= pageCount" label="next" :loading-time=100 />
            <Button icon="fa fa-refresh" @click="$emit('refresh')" label="refresh" />
            {{ $t('search') }}：
            <input type="text" v-model="searchTerm" :placeholder="$t('enterTips')" class="input w-full max-w-xs" />
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
        searchKeys: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currentPage: 1,
            searchTerm: '',
            searchGroup: '',
            showDemoTip: false,
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
                    this.searchKeys.some(key =>
                        item[key] ? item[key].includes(this.searchTerm) : false
                    ) &&
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
    mounted() {
        this.showDemoTip = import.meta.env.VITE_APP_MOCK === 'true';
    }
}
</script>