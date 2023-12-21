# tiktok-vue

```shell
# vue
npm create vue@latest
npm install
npm run dev
npm run build
# tailwindcss
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

## Pagination

```vue
<Pagination :items="devices" :pageSize="5" searchKey="name">
    <template v-slot:buttons>
        <Button label="Button 1" />
        <Button label="Button 2" />
        <!-- 添加更多按钮 -->
    </template>
    <template v-slot:default="slotProps">
        <div v-for="item in slotProps.items" :key="item.id">
            <!-- 在这里添加你自己的内容 -->
        </div>
    </template>
</Pagination>
```
