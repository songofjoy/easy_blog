<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="(item, index) in menuList">
            <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="'normal-' + index">
                <Icon :type="item.icon" :size="iconSize" :key="'normal-' + index + '-icon'"></Icon>
                <span class="layout-text" :key="'normal-' + index + '-span'">{{ itemTitle(item) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length > 1" :name="item.name" :key="'normal-' + index + '-submenu'">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="(child, i) in item.children">
                    <MenuItem :name="child.name" :key="'normal-' + index + '-' + i">
                        <Icon :type="child.icon" :size="iconSize" :key="'normal-' + index + '-' + i + '-icon'"></Icon>
                        <span class="layout-text" :key="'normal-' + index + '-' + i + '-span'">{{ child.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark',
        },
        openNames: {
            type: Array,
        },
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    },

};
</script>
