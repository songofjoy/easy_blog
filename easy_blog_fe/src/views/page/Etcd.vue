<template>
    <div>
        <Card>
            <Form inline>
                <FormItem>
                    <Select v-model="searchForm.dc" placeholder="机房" style="width: 150px;">
                        <Option v-for="i in dcList" :value="i.value" :key="i.value">{{ i.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="searchForm.searchType" @on-change="searchTypeChange" style="width: 150px;">
                        <Option v-for="i in searchForm.searchTypeList" :value="i.label" :key="i.label">{{i.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="searchForm.searchType !== searchForm.searchTypeList[4].label">
                    <Select v-model="searchForm.configKey" placeholder="Config Key (支持搜索)" filterable style="width: 300px;">
                        <Option v-for="i in configKeyList" :value="i.value" :key="i.value">{{i.label}}-{{i.value}}</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="searchForm.searchType === searchForm.searchTypeList[4].label">
                    <i-input v-model="searchForm.key" placeholder="Etcd Key" style="width: 400px;"></i-input>
                </FormItem>
                <FormItem>
                    <Button type="info" @click="search">检索配置</Button>
                </FormItem>
                <FormItem>
                    <Button v-show="showSubmit" type="primary" @click="submit">配置生效</Button>
                </FormItem>
            </Form>

            <div v-show="showSubmit">
                <RadioGroup v-model="inputType" type="button" style="margin-bottom: 24px;" @on-change="changeInputType">
                    <Radio :label='1'>常规文本</Radio>
                    <Radio :label='2'>JSON</Radio>
                    <Radio :label='3'>yaml</Radio>
                    <Radio :label='4'>操作历史</Radio>
                </RadioGroup>
                <vue-json-editor v-if="inputType === 2" v-model="valueObj" :showBtns="false" @json-change="changeConfig"></vue-json-editor>
                <div v-else-if="inputType === 4">
                    <Table stripe border :columns="columns1" :data="data1" :loading="searchForm.loading"></Table>
                    <Page size="small" :total="total" :current="page" :page-size="pagesize" show-total show-sizer
                          @on-change="changepage" @on-page-size-change="changepageSize"></Page>
                </div>
                <Input v-else v-model="value" type="textarea" :autosize="true"/>
            </div>
        </Card>

        <div>
            <Modal v-model="modal.show" fullscreen :title="modal.title">
                <div v-html="modal.msg" align="center"></div>
                <div slot="footer">
                    <Button type="error" @click="rollback_confirm" :loading="loading">回滚</Button>
                    <Button type="info" @click="callcell">取消</Button>
                </div>
            </Modal>
            <Modal v-model="searchForm.modal_show" title="变动原因描述" @on-ok="ok_researon">
                <Span style="color:red; font-size: 20px">*</Span>
                <Input v-model="searchForm.reason" placeholder="变动原因描述，类似于git commit" clearable :rows="4" type="textarea" style="width: 95%; margin-left: 10px;"/>
            </Modal>
        </div>
    </div>
</template>

<script>
    import Const from '@/libs/const';
    import request from '@/libs/request';
    import vueJsonEditor from 'vue-json-editor';
    import util from '@/libs/util';

    export default {
        name: 'Etcd',
        data () {
            return {
                modal: {
                    show: false,
                    title: 'ETCD相邻版本对比',
                    msg: '',
                    width: 80,
                },
                data1: [],
                columns1: [
                    {
                        type: 'index',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '操作人',
                        key: 'operator',
                        width: 120,
                        align: 'center',
                    },
                    {
                        title: 'etcd_key',
                        key: 'etcd_key',
                        width: 180,
                        align: 'center',
                    },
                    // {
                    //     title: '上一版本配置',
                    //     key: 'old_etcd_config_html',
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         let data = params.row.old_etcd_config;
                    //         return h('p', {
                    //             style: {
                    //                 textAlign: 'left',
                    //             },
                    //         }, data);
                    //     },
                    // },
                    // {
                    //     title: '当前配置',
                    //     key: 'current_etcd_config',
                    //     align: 'center',
                    //     resize: true,
                    //     render: (h, params) => {
                    //         let data = params.row.current_etcd_config;
                    //         return h('p', {
                    //             style: {
                    //                 textAlign: 'left',
                    //             },
                    //         }, data);
                    //     },
                    // },
                    {
                        title: '缩略差异',
                        key: 'diff',
                        align: 'center',
                        render: (h, params) => {
                            return h('pre', {
                                style: {
                                    textAlign: 'left',
                                    overflow: 'auto',
                                },
                            }, params.row.diff);
                        },
                    },
                    {
                        title: '操作时间',
                        key: 'operation_time',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                // h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small',
                                //     },
                                //     style: {
                                //         marginRight: '5px',
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.table_index = params.index;
                                //             this.$Modal.confirm({
                                //                 content: '您确定用上一个版本的值[<br>' + this.data1[params.index].old_etcd_config + '<br>]来替代当前版本!',
                                //                 onOk: this.rollback,
                                //             });
                                //         },
                                //     },
                                // }, '回滚'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                    },
                                    on: {
                                        click: () => {
                                            this.table_index = params.index;
                                            this.diff_text(params.index);
                                        },
                                    },
                                }, '全量差异'),
                            ]);
                        },
                    },
                ],
                total: 0,
                pagesize: 10,
                page: 1,

                table_index: '',
                searchForm: {
                    dc: '',
                    key: '',
                    reason: '',
                    searchType: 0,
                    searchTypeList: [
                        {
                            label: 0,
                            name: 'router_conf',
                        },
                        {
                            label: 1,
                            name: 'router_rules',
                        },
                        {
                            label: 2,
                            name: 'pipeline_conf',
                        },
                        {
                            label: 3,
                            name: 'pipeline_rules',
                        },
                        {
                            label: 4,
                            name: '文本输入etcd key',
                        },
                    ],
                    configKey: 0,
                    modal_show: false,
                },
                dcList: [],
                configKeyList: [],
                showSubmit: false,
                inputType: 1,
                value: '',
                valueObj: null,
                loading: false,
            };
        },
        methods: {
            callcell () {
                this.modal.show = false;
            },
            changepage (page) {
                this.data1 = [];
                this.changeInputType(4, page);
            },
            changepageSize (pagesize) {
                this.pagesize = pagesize;
                this.changepage(4, 1);
            },
            search () {
                if (this.searchForm.dc === '') {
                    this.$Message.warning('参数不全');
                    return 0;
                }
                if (this.searchForm.searchType !== this.searchForm.searchTypeList[4].label
                    && !this.searchForm.configKey) {
                    this.$Message.warning('参数Config Key不允许为空');
                    return 0;
                }
                if (this.searchForm.searchType === this.searchForm.searchTypeList[4].label
                    && !this.searchForm.key) {
                    this.$Message.warning('参数Etcd Key不允许为空');
                    return 0;
                }

                if (this.searchForm.searchType !== this.searchForm.searchTypeList[4].label) {
                    let searchtype_value = this.searchForm.searchTypeList[this.searchForm.searchType];
                    let searchtype_values = searchtype_value.name.split('_');
                    this.searchForm.key = Const.ETCD_KEY.prefix + searchtype_values[0] + '/' + this.searchForm.configKey + '_' + searchtype_values[1];
                }

                request({
                    url: '/api/tools/get_etcd_value/',
                    params: {
                        dc: this.searchForm.dc,
                        key: this.searchForm.key.trim(),
                    },
                    method: 'get',
                }).then((res) => {
                    if (res.code === 0) {
                        this.inputType = 1;
                        this.value = res.value;
                        this.showSubmit = true;
                        util.reset_url(this.$router, {
                            dc: this.searchForm.dc,
                            key: this.searchForm.key,
                            search_type: this.searchForm.searchType,
                            config_key: this.searchForm.configKey,
                        });
                    }
                });
            },
            ok_researon () {
                if (this.searchForm.dc === 0) {
                    this.$Modal.confirm({
                        content: '保存后国内外三机房会同时同步, 而且会直接在线上生效！！！请确认修改！',
                        onOk: this.save_etcd_pre,
                    });
                } else {
                    this.$Modal.confirm({
                        content: '保存后会直接在线上生效！！！请确认修改！',
                        onOk: this.save_etcd_pre,
                    });
                }
            },
            submit () {
                if (this.searchForm.dc === '') {
                    this.$Message.warning('参数不全');
                    return 0;
                }
                if (!this.value) {
                    this.$Message.warning('提交的配置不能为空');
                    return 0;
                }
                if (this.inputType === Const.INPUT_TYPE.history) {
                    this.$Message.warning('提交的配置不能为操作历史数据');
                    return 0;
                }

                this.searchForm.modal_show = true;
                this.searchForm.reason = '';
            },
            save_etcd_pre () {
                request({
                    url: '/api/tools/get_all_values/',
                    data: {
                        dc: this.searchForm.dc,
                        key: this.searchForm.key,
                    },
                    method: 'post',
                }).then((res) => {
                    if (res.all_equal) {
                        this.saveEtcd();
                    } else {
                        this.$Modal.confirm({
                            content: this.searchForm.key + ', 在其它机房已有不同值，您确定将国内外三机房的值同时覆盖！！！请再次确认修改！',
                            onOk: this.saveEtcd,
                        });
                    }
                });
            },
            saveEtcd () {
                request({
                    url: '/api/tools/set_etcd_value/',
                    data: {
                        dc: this.searchForm.dc,
                        key: this.searchForm.key,
                        input_type: this.inputType,
                        value: this.value,
                        search_type: this.searchForm.searchType,
                        reason: this.searchForm.reason,
                    },
                    method: 'post',
                }).then((res) => {
                    if (res.code === 0) {
                        this.$Message.success(res.message);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            rollback_confirm () {
                this.$Modal.confirm({
                    content: '您确定用上一个版本的值[<br><br>' + this.data1[this.table_index].old_etcd_config + '<br><br>]来替代当前版本!',
                    onOk: this.rollback,
                });
            },
            rollback () {
                this.loading = true;
                request({
                    url: '/api/tools/set_etcd_value/',
                    data: {
                        dc: this.searchForm.dc,
                        key: this.data1[this.table_index].etcd_key,
                        input_type: this.inputType,
                        value: this.data1[this.table_index].old_etcd_config,
                        reason: '回滚',
                    },
                    method: 'post',
                }).then((res) => {
                    if (res.code === 0) {
                        this.$Message.info({
                            content: '回滚成功,重新点击"检索配置"按钮,查看最新ETCD的配置值.',
                            duration: 10,
                            closable: true,
                        });
                        this.modal.show = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.loading = false;
                });
            },
            diff_text (index) {
                request({
                    url: '/api/tools/get_diff_text/',
                    data: {
                        key: this.data1[index].etcd_key,
                        current_config: this.data1[index].current_etcd_config,
                        old_config: this.data1[index].old_etcd_config,
                    },
                    method: 'post',
                }).then((res) => {
                    if (res.code === 0) {
                        this.modal.msg = res.msg;
                        this.modal.width = 100;
                    } else {
                        this.$Message.error(res.msg);
                    }
                }).catch((res) => {
                    this.modal.msg = res.msg;
                    this.modal.width = res.width;
                });
                this.modal.show = true;
            },
            changeConfig (obj) {
                this.value = JSON.stringify(obj);
            },
            changeInputType (val, page) {
                if (val === Const.INPUT_TYPE.json) {
                    try {
                        this.valueObj = JSON.parse(this.value);
                    } catch (ex) {
                        this.valueObj = null;
                    }
                }
                if (val === Const.INPUT_TYPE.history) {
                    this.searchForm.loading = true;
                    request({
                        url: '/api/tools/get_history_etcd/',
                        method: 'get',
                        params: {
                            key: this.searchForm.key,
                            offset: page ? (page - 1) * this.pagesize : 0,
                            limit: this.pagesize,
                        },
                    }).then((res) => {
                        this.data1 = res.etcd_config;
                        this.total = res.total;
                        this.searchForm.loading = false;
                    });
                }
            },
            searchTypeChange () {
                this.showSubmit = false;
                this.searchForm.key = '';
            },
        },
        components: {
            vueJsonEditor,
        },
        created () {
            this.searchForm.searchType = parseInt(this.$route.query.search_type) ? parseInt(this.$route.query.search_type) : 4;
        },
        mounted () {
            request({
                url: '/api/tools/etcd_init/',
            }).then((res) => {
                if (res.code === 0) {
                    this.dcList = res.dc_list;
                    this.configKeyList = res.config_key_list;

                    if (this.$route.query.config_key || this.$route.query.key) {
                        this.searchForm.dc = this.dcList[this.$route.query.dc ? this.$route.query.dc : 0].value;
                        this.searchForm.key = this.$route.query.key;
                        this.searchForm.configKey = this.$route.query.config_key;
                        this.search();
                    }
                }
            });
        },
    };
</script>

<style scoped>

</style>