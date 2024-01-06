# tiktok-vue
## Deployment
### one master node with multiple worker nodes
### support no limit android devices if you have enough pc and android devices
![](framework.png)
## get started
```shell
# vue
git clone https://github.com/niostack/tiktok-vue.git
cd tiktok-vue
npm install
# for demo
npm run dev
# for production
npm run build
```
## for development
```shell
# install tailwindcss
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```
### Pagination component

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
