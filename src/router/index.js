import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        // 集群
        // keepAlive: true
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'home',
            meta: { title: '集群' },
            children: [
                {
                    path: '/',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    icon: require('../assets/img/indexHome.png'),
                    redirect: '/login',
                    meta: { title: '系统首页' },
                    children: [
                        {
                            path: '/index',
                            component: () => import(/* webpackChunkName: "icon" */ '../components/views/colony/index/index.vue'),
                            meta: { title: '系统' }
                        },
                        {
                            path: '/index/user',
                            component: () => import(/* webpackChunkName: "icon" */ '../components/views/colony/index/userOnLine.vue'),
                            meta: { title: '用户统计' },
                            hide: true
                        }
                    ]
                },
                {
                    path: '/info',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    icon: require('../assets/img/url.png'),
                    meta: { title: '集群基本信息' },
                    children: [
                        {
                            path: 'setting',
                            component: () => import('../components/views/colony/info/setting.vue'),
                            meta: { title: '配置' }
                        },

                        {
                            path: 'active',
                            component: () => import('../components/views/colony/info/active.vue'),
                            meta: { title: '激活信息' }
                        }
                    ]
                },
                {
                    path: '/personal/changePwd',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/personal/changePwd.vue'),
                    meta: { title: '修改密码' },
                    hide: true
                },
                {
                    path: '/privilege',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '系统设置', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/indexPrivilege.png'),
                    children: [
                        {
                            path: 'role',
                            component: () => import('../components/views/colony/privilege/role.vue'),
                            meta: { title: '角色管理' }
                        },
                        {
                            path: 'admin',
                            component: () => import('../components/views/colony/privilege/admin.vue'),
                            meta: { title: '管理员管理' }
                        },
                        {
                            path: 'admin/addAdmin',
                            component: () => import('../components/views/colony/privilege/addAdmin.vue'),
                            meta: { title: '添加用户' },
                            hide: true
                        }
                    ]
                },
                {
                    path: '/reconstruction',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '数据库', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/reconstruction.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/reconstruction/index.vue'),
                            meta: { title: '数据备份' }
                        }
                    ]
                },
                {
                    path: '/collection',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '馆藏统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerCollection.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/collection/index.vue'),
                            meta: { title: '馆藏统计', keepAlive: true }
                        }
                    ]
                },
                {
                    path: '/classification',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '分类统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/clos.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/classification/index.vue'),
                            meta: { title: '分类统计', keepAlive: true }
                        }
                    ]
                },

                {
                    path: '/circulation',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '流通统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/circulationManage.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/circulation/index.vue'),
                            meta: { title: '流通统计', keepAlive: true }
                        }
                    ]
                },
                {
                    path: '/reader',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '读者统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/circulationReader.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/reader/index.vue'),
                            meta: { title: '读者统计', keepAlive: true }
                        }
                    ]
                },
                {
                    path: '/echarts',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '报表统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerRetrieval.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/colony/echarts/index.vue'),
                            meta: { title: '报表统计', keepAlive: true }
                        }
                    ]
                },
                {
                    path: '/subPlatform',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '子平台管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/indexSubPlatform.png'),
                    children: [
                        {
                            path: 'superManager',
                            component: () => import('../components/views/colony/subPlatform/superManager.vue'),
                            meta: { title: '子平台管理' }
                        },
                        {
                            path: 'message/index',
                            component: () => import('../components/views/colony/subPlatform/message/configure.vue'),
                            meta: { title: '短信管理' }
                        },
                        {
                            path: 'wx',
                            component: () => import('../components/views/colony/subPlatform/wx.vue'),
                            meta: { title: '微信支付配置' }
                        },
                        {
                            path: 'number',
                            component: () => import('../components/views/colony/subPlatform/number.vue'),
                            meta: { title: '四角号码库' }
                        },
                        {
                            path: 'isbnPulisher',
                            component: () => import('../components/views/colony/subPlatform/isbnPulisher.vue'),
                            meta: { title: '出版社库维护' }
                        },
                        {
                            path: 'params',
                            component: () => import('../components/views/colony/subPlatform/params.vue'),
                            meta: { title: '公共参数' }
                        },
                        {
                            path: 'admin/addAdmin',
                            component: () => import('../components/views/colony/privilege/addAdmin.vue'),
                            meta: { title: '添加用户' },
                            hide: true
                        }
                    ]
                }
            ]
        },

        // 子平台
        {
            path: '/subIndex',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/index.vue'),
            icon: 'el-icon-lx-home',
            name: 'subIndex',

            meta: { title: '选择页面' }
        },
        // 子系统设置
        {
            path: '/manage',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'manage',
            meta: { title: '系统模块' },
            children: [
                {
                    path: 'parameter',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '系统设置', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/default.png'),
                    children: [
                        {
                            path: 'infos',
                            component: () => import('../components/views/system/infos.vue'),
                            meta: { title: '平台信息' }
                        },
                        {
                            path: 'admin',
                            component: () => import('../components/views/privilege/admin.vue'),
                            meta: { title: '管理员管理' }
                        },
                        {
                            path: 'admin/addAdmin',
                            component: () => import('../components/views/privilege/addAdmin.vue'),
                            meta: { title: '添加用户' },
                            hide: true
                        },
                        {
                            path: 'role',
                            component: () => import('../components/views/privilege/role.vue'),
                            meta: { title: '角色设置' }
                        },
                        {
                            path: 'parameters',
                            component: () => import('../components/views/system/parameters.vue'),
                            meta: { title: '公共参数' }
                        },
                        {
                            path: 'parameters/add',
                            component: () => import('../components/views/system/parametersAdd.vue'),
                            meta: { title: '编目公共参数' },
                            hide: true
                        },
                        {
                            path: 'collection',
                            component: () => import('../components/views/system/collection.vue'),
                            meta: { title: '馆藏地点' }
                        },
                        {
                            path: 'batch',
                            component: () => import('../components/views/system/batch.vue'),
                            meta: { title: '批次管理' }
                        },
                        {
                            path: 'Z39Agreement',
                            component: () => import('../components/views/system/Z39Agreement.vue'),
                            meta: { title: 'Z39.50管理' }
                        },
                        // {
                        //     path: 'press',
                        //     component: () => import('../components/views/system/press.vue'),
                        //     meta: { title: '出版社库管理', },
                        // },

                        {
                            path: 'titleNumber',
                            component: () => import('../components/views/system/titleNumber.vue'),
                            meta: { title: '种次号库维护' }
                        },
                        {
                            path: 'material',
                            component: () => import('../components/views/system/material.vue'),
                            meta: { title: '供货单位管理' }
                        },
                        {
                            path: 'barCode',
                            component: () => import('../components/views/system/barCode.vue'),
                            meta: { title: '条码设置' }
                        },
                        {
                            path: 'cable',
                            component: () => import('../components/views/system/cable.vue'),
                            meta: { title: '索书号生成方式' }
                        },
                        {
                            path: 'standNo',
                            component: () => import('../components/views/system/standNo.vue'),
                            meta: { title: '架位号设置方式' }
                        },
                        {
                            path: 'initialization',
                            component: () => import('../components/views/system/init'),
                            meta: { title: '系统数据管理' }
                        }
                    ]
                },
                {
                    path: 'MARC',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: 'MARC参数', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/Mark.png'),
                    children: [
                        {
                            path: 'type',
                            component: () => import('../components/views/MARC/type.vue'),
                            meta: { title: 'MARC类型' }
                        },
                        {
                            path: 'type/field',
                            component: () => import('../components/views/MARC/field.vue'),
                            meta: { title: 'MARC字段设置' },
                            hide: true
                        },
                        {
                            path: 'type/field/son',
                            component: () => import('../components/views/MARC/fieldSon.vue'),
                            meta: { title: 'MARC子字段设置' },
                            hide: true
                        },
                        // {
                        //     path: 'indexes',
                        //     component: () => import('../components/views/MARC/indexes.vue'),
                        //     meta: { title: 'MARC索引设置', },
                        // },
                        {
                            path: 'mouldEdit',
                            component: () => import('../components/views/MARC/mouldEdit.vue'),
                            meta: { title: 'MARC模板编辑' },
                            hide: true
                        },
                        {
                            path: 'mould',
                            component: () => import('../components/views/MARC/mould.vue'),
                            meta: { title: 'MARC模板' }
                        }
                    ]
                },
                {
                    path: 'email',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '邮件管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/email.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/system/email/index.vue'),
                            meta: { title: '邮件库' }
                        },
                        {
                            path: 'configure',
                            component: () => import('../components/views/system/email/setting.vue'),
                            meta: { title: '邮件配置' }
                        }
                    ]
                },
                {
                    path: 'message',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '短信管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/msg.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/system/message/index.vue'),
                            meta: { title: '短信库' }
                        }
                    ]
                },
                {
                    path: 'interface',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '数据接口', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/shuju.png'),
                    children: [
                        {
                            path: 'upload',
                            component: () => import('../components/views/system/interface/upload.vue'),
                            meta: { title: '套录库数据导入' }
                        },
                        {
                            path: 'upload/copyImport',
                            component: () => import('../components/views/system/interface/copyImport.vue'),
                            meta: { title: '套录库数据导入' },
                            hide: true
                        },
                        {
                            path: 'index',
                            component: () => import('../components/views/system/interface/index.vue'),
                            meta: { title: '套录库维护' }
                        },
                        {
                            path: 'uploadBook',
                            component: () => import('../components/views/system/interface/uploadBook.vue'),
                            meta: { title: '馆藏书目导入' }
                        },
                        {
                            path: 'uploadBook/copyImport',
                            component: () => import('../components/views/system/interface/opyImportBook.vue'),
                            meta: { title: '馆藏书目接收' },
                            hide: true
                        },
                        {
                            path: 'exportOut',
                            component: () => import('../components/views/system/interface/exportOut.vue'),
                            meta: { title: '馆藏书目输出' }
                        },
                        {
                            path: 'exportOut/outSet',
                            component: () => import('../components/views/system/interface/outSet.vue'),
                            meta: { title: '馆藏书目字段设置' },
                            hide: true
                        },
                        // {
                        //     path: 'exportMacrOut',
                        //     component: () => import('../components/views/system/interface/exportMacrOut.vue'),
                        //     meta: { title: '书目MARC输出', },
                        // },
                        {
                            path: 'outSetBook',
                            component: () => import('../components/views/system/interface/outSetBook.vue'),
                            meta: { title: '书目输出字段设置' },
                            hide: true
                        },

                        {
                            path: 'out/addNote',
                            component: () => import('../components/views/system/OPAC/outAdd.vue'),
                            meta: { title: '书目输出' },
                            hide: true
                        },
                        {
                            path: 'excel',
                            component: () => import('../components/views/system/interface/excel.vue'),
                            meta: { title: 'Excel转Marc' }
                        },
                        {
                            path: 'uploadList',
                            component: () => import('../components/views/system/interface/uploadList.vue'),
                            meta: { title: '导入文献流通' }
                        }
                    ]
                }
            ]
        },
        // 报表模块
        {
            path: '/echarts',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'echarts',
            meta: { title: '报表模块' },
            children: [
                {
                    path: 'periodical',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊报表', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/echart.png'),
                    children: [
                        {
                            path: 'booking',
                            component: () => import('../components/views/echarts/periodical/booking.vue'),
                            meta: { title: '预订单' }
                        },
                        {
                            path: 'bookingList',
                            component: () => import('../components/views/echarts/periodical/bookingList.vue'),
                            meta: { title: '预订单列表' },
                            hide: true
                        },
                        {
                            path: 'remember',
                            component: () => import('../components/views/echarts/periodical/remember.vue'),
                            meta: { title: '记到单' }
                        },
                        {
                            path: 'rememberList',
                            component: () => import('../components/views/echarts/periodical/rememberList.vue'),
                            meta: { title: '记到单列表' },
                            hide: true
                        },

                        {
                            path: 'binding',
                            component: () => import('../components/views/echarts/periodical/binding.vue'),
                            meta: { title: '装订单' }
                        },
                        {
                            path: 'bindingList',
                            component: () => import('../components/views/echarts/periodical/bindingList.vue'),
                            meta: { title: '装订单列表' },
                            hide: true
                        },

                        {
                            path: 'catalogue',
                            component: () => import('../components/views/echarts/periodical/catalogue.vue'),
                            meta: { title: '编目清单' }
                        },
                        {
                            path: 'catalogueList',
                            component: () => import('../components/views/echarts/periodical/catalogueList.vue'),
                            meta: { title: '编目清单清单' },
                            hide: true
                        },

                        {
                            path: 'distribute',
                            component: () => import('../components/views/echarts/periodical/distribute.vue'),
                            meta: { title: '分发清单' }
                        },
                        {
                            path: 'distributeList',
                            component: () => import('../components/views/echarts/periodical/distributeList.vue'),
                            meta: { title: '分发清单列表' },
                            hide: true
                        },

                        {
                            path: 'book',
                            component: () => import('../components/views/echarts/periodical/book.vue'),
                            meta: { title: '预订统计' }
                        },
                        {
                            path: 'bookList',
                            component: () => import('../components/views/echarts/periodical/bookList.vue'),
                            meta: { title: '预订统计列表' },
                            hide: true
                        },

                        {
                            path: 'library',
                            component: () => import('../components/views/echarts/periodical/library.vue'),
                            meta: { title: '到馆统计' }
                        },
                        {
                            path: 'libraryList',
                            component: () => import('../components/views/echarts/periodical/libraryList.vue'),
                            meta: { title: '到馆统计列表' },
                            hide: true
                        },

                        {
                            path: 'bindings',
                            component: () => import('../components/views/echarts/periodical/bindings.vue'),
                            meta: { title: '装订统计' }
                        },
                        {
                            path: 'bindingsList',
                            component: () => import('../components/views/echarts/periodical/bindingsList.vue'),
                            meta: { title: '装订统计列表' },
                            hide: true
                        },

                        {
                            path: 'catalogues',
                            component: () => import('../components/views/echarts/periodical/catalogues.vue'),
                            meta: { title: '编目统计' }
                        },
                        {
                            path: 'cataloguesList',
                            component: () => import('../components/views/echarts/periodical/cataloguesList.vue'),
                            meta: { title: '编目统计列表' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'catalogue',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '编目报表', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/echarts.png'),
                    children: [
                        {
                            path: 'catalogue',
                            component: () => import('../components/views/echarts/catalogue/catalogue.vue'),
                            meta: { title: '编目清单' }
                        },
                        {
                            path: 'catalogueList',
                            component: () => import('../components/views/echarts/catalogue/catalogueList.vue'),
                            meta: { title: '预编目清单列表' },
                            hide: true
                        },
                        {
                            path: 'classification',
                            component: () => import('../components/views/echarts/catalogue/classification.vue'),
                            meta: { title: '分类统计' }
                        },
                        {
                            path: 'classificationList',
                            component: () => import('../components/views/echarts/catalogue/classificationList.vue'),
                            meta: { title: '分类统计列表' },
                            hide: true
                        },
                        {
                            path: 'workload',
                            component: () => import('../components/views/echarts/catalogue/workload.vue'),
                            meta: { title: '工作量统计' }
                        },
                        {
                            path: 'workloadList',
                            component: () => import('../components/views/echarts/catalogue/workloadList.vue'),
                            meta: { title: '工作量统计列表' },
                            hide: true
                        },
                        {
                            path: 'comprehensive',
                            component: () => import('../components/views/echarts/catalogue/comprehensive.vue'),
                            meta: { title: '编目综合统计' }
                        },
                        {
                            path: 'comprehensiveList',
                            component: () => import('../components/views/echarts/catalogue/comprehensiveList.vue'),
                            meta: { title: '编目综合统计列表' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'circulation',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '流通报表', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/echart.png'),
                    children: [
                        {
                            path: 'appointment',
                            component: () => import('../components/views/echarts/circulation/appointment.vue'),
                            meta: { title: '预约清单' }
                        },
                        {
                            path: 'appointmentList',
                            component: () => import('../components/views/echarts/circulation/appointmentList.vue'),
                            meta: { title: '预约清单列表' },
                            hide: true
                        },
                        {
                            path: 'category',
                            component: () => import('../components/views/echarts/circulation/category.vue'),
                            meta: { title: '预约类别统计' }
                        },
                        {
                            path: 'categoryList',
                            component: () => import('../components/views/echarts/circulation/categoryList.vue'),
                            meta: { title: '预约类别统计列表' },
                            hide: true
                        },
                        {
                            path: 'reading',
                            component: () => import('../components/views/echarts/circulation/reading.vue'),
                            meta: { title: '阅览清单' }
                        },
                        {
                            path: 'readingList',
                            component: () => import('../components/views/echarts/circulation/readingList.vue'),
                            meta: { title: '阅览清单列表' },
                            hide: true
                        },
                        {
                            path: 'readStatistics',
                            component: () => import('../components/views/echarts/circulation/readStatistics.vue'),
                            meta: { title: '阅览统计' }
                        },
                        {
                            path: 'readStatisticsList',
                            component: () => import('../components/views/echarts/circulation/readStatisticsList.vue'),
                            meta: { title: '阅览统计列表' },
                            hide: true
                        },
                        {
                            path: 'bookBorrow',
                            component: () => import('../components/views/echarts/circulation/bookBorrow.vue'),
                            meta: { title: '文献借阅清单' }
                        },
                        {
                            path: 'bookBorrowList',
                            component: () => import('../components/views/echarts/circulation/bookBorrowList.vue'),
                            meta: { title: '文献借阅清单列表' },
                            hide: true
                        },
                        {
                            path: 'typeBorrow',
                            component: () => import('../components/views/echarts/circulation/typeBorrow.vue'),
                            meta: { title: '类别借阅统计' }
                        },
                        {
                            path: 'typeBorrowList',
                            component: () => import('../components/views/echarts/circulation/typeBorrowList.vue'),
                            meta: { title: '类别借阅统计列表' },
                            hide: true
                        },
                        {
                            path: 'borrowRanking',
                            component: () => import('../components/views/echarts/circulation/borrowRanking.vue'),
                            meta: { title: '文献借阅排行' }
                        },
                        {
                            path: 'borrowRankingList',
                            component: () => import('../components/views/echarts/circulation/borrowRankingList.vue'),
                            meta: { title: '文献借阅排行列表' },
                            hide: true
                        },
                        {
                            path: 'readRanking',
                            component: () => import('../components/views/echarts/circulation/readRanking.vue'),
                            meta: { title: '读者阅读排行' }
                        },
                        {
                            path: 'readRankingList',
                            component: () => import('../components/views/echarts/circulation/readRankingList.vue'),
                            meta: { title: '读者阅读排行列表' },
                            hide: true
                        }
                    ]
                }
            ]
        },
        // 子平台编目
        {
            path: '/catalogue',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'catalogue',
            meta: { title: '编目模块' },
            children: [
                {
                    path: 'literature',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '文献编目', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerLiterature.png'),
                    children: [
                        {
                            path: 'library',
                            component: () => import('../components/views/literature/library.vue'),
                            meta: { title: '图书编目', keepAlive: true }
                        },
                        {
                            path: 'library/libraryBookInfo',
                            component: () => import('../components/views/literature/libraryBookInfo.vue'),
                            meta: { title: '编辑图书' },
                            hide: true
                        },
                        {
                            path: 'library/libraryInfo',
                            component: () => import('../components/views/literature/libraryInfo.vue'),
                            meta: { title: '图书编目' },
                            hide: true
                        },
                        {
                            path: 'bookLabel',
                            component: () => import('../components/views/literature/bookLabel.vue'),
                            meta: { title: '书标打印', keepAlive: true }
                        },
                        {
                            path: 'bookLabel/bookLabelFor',
                            component: () => import('../components/views/literature/bookLabelFor.vue'),
                            meta: { title: '书标打印预览' },
                            hide: true
                        },
                        {
                            path: 'barCode',
                            component: () => import('../components/views/literature/barCode.vue'),
                            meta: { title: '条码打印', keepAlive: true }
                        },
                        {
                            path: 'barCode/barCodeFor',
                            component: () => import('../components/views/literature/barCodeFor.vue'),
                            meta: { title: '条码打印浏览' },
                            hide: true
                        },
                        {
                            path: 'classify',
                            component: () => import('../components/views/literature/classify.vue'),
                            meta: { title: '分类浏览', keepAlive: true }
                        }
                    ]
                },
                {
                    path: 'retrieval',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '图书检索', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerRetrieval.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/retrieval/index.vue'),
                            meta: { title: '图书检索', keepAlive: true }
                        },
                        {
                            path: 'detail',
                            component: () => import('../components/views/retrieval/detail.vue'),
                            meta: { title: '详情' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'collection',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '馆藏处理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerCollection.png'),
                    children: [
                        {
                            path: 'inventory',
                            component: () => import('../components/views/collection/inventory.vue'),
                            meta: { title: '图书盘点' }
                        },
                        {
                            path: 'destroy',
                            component: () => import('../components/views/collection/destroy.vue'),
                            meta: { title: '图书注销', keepAlive: true }
                        },
                        {
                            path: 'delete',
                            component: () => import('../components/views/collection/delete.vue'),
                            meta: { title: '条码删除', keepAlive: true }
                        },
                        {
                            path: 'replace',
                            component: () => import('../components/views/collection/replace.vue'),
                            meta: { title: '条码替换', keepAlive: true }
                        },
                        {
                            path: 'searchBroken',
                            component: () => import('../components/views/collection/searchBroken.vue'),
                            meta: { title: '断号查询' }
                        },
                        {
                            path: 'allocation',
                            component: () => import('../components/views/collection/allocation.vue'),
                            meta: { title: '馆藏地调拨' }
                        },
                        {
                            path: 'standNo',
                            component: () => import('../components/views/collection/standNo.vue'),
                            meta: { title: '架位号设定' }
                        },
                        {
                            path: 'modification',
                            component: () => import('../components/views/collection/modification.vue'),
                            meta: { title: '馆藏批处理' }
                        },
                        {
                            path: 'MARCdel',
                            component: () => import('../components/views/collection/MARCdel.vue'),
                            meta: { title: 'MARC批处理' }
                        },
                        {
                            path: 'unUserd',
                            component: () => import('../components/views/collection/unUserd.vue'),
                            meta: { title: '未利用书目批删除' }
                        },
                        {
                            path: 'unable',
                            component: () => import('../components/views/collection/unable.vue'),
                            meta: { title: '不规范MARC' }
                        }
                    ]
                },
                {
                    path: 'parameter',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '编目参数', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerParameter.png'),
                    children: [
                        {
                            path: 'setting',
                            component: () => import('../components/views/parameter/setting.vue'),
                            meta: { title: '编目设置' }
                        }
                        // {
                        //     path: 'batch',
                        //     component: () => import('../components/views/parameter/batch.vue'),
                        //     meta: { title: '批次管理', },
                        // },
                    ]
                },
                {
                    path: 'echart',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '编目统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/echarts.png'),
                    children: [
                        {
                            path: 'catalogue',
                            component: () => import('../components/views/catalogue/echart/catalogue.vue'),
                            meta: { title: '编目清单' }
                        },
                        {
                            path: 'catalogueList',
                            component: () => import('../components/views/catalogue/echart/catalogueList.vue'),
                            meta: { title: '预编目清单列表' },
                            hide: true
                        },
                        {
                            path: 'classification',
                            component: () => import('../components/views/catalogue/echart/classification.vue'),
                            meta: { title: '分类统计' }
                        },
                        {
                            path: 'classificationList',
                            component: () => import('../components/views/catalogue/echart/classificationList.vue'),
                            meta: { title: '分类统计列表' },
                            hide: true
                        },
                        {
                            path: 'workload',
                            component: () => import('../components/views/catalogue/echart/workload.vue'),
                            meta: { title: '工作量统计' }
                        },
                        {
                            path: 'workloadList',
                            component: () => import('../components/views/catalogue/echart/workloadList.vue'),
                            meta: { title: '工作量统计列表' },
                            hide: true
                        },
                        {
                            path: 'comprehensive',
                            component: () => import('../components/views/catalogue/echart/comprehensive.vue'),
                            meta: { title: '编目综合统计' }
                        },
                        {
                            path: 'comprehensiveList',
                            component: () => import('../components/views/catalogue/echart/comprehensiveList.vue'),
                            meta: { title: '编目综合统计列表' },
                            hide: true
                        }
                    ]
                }
            ]
        },
        // 子平台期刊
        {
            path: '/periodical',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'periodical',
            meta: { title: '期刊模块' },
            children: [
                {
                    path: 'reserve',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊预定', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/periodicalReserve.png'),
                    children: [
                        {
                            path: 'accept',
                            component: () => import('../components/views/periodical/reserve/accept.vue'),
                            meta: { title: '预定数据接收' }
                        },
                        {
                            path: 'show/copyImport',
                            component: () => import('../components/views/periodical/reserve/show.vue'),
                            meta: { title: '加载数据' },
                            hide: true
                        },
                        {
                            path: 'index',
                            component: () => import('../components/views/periodical/reserve/index.vue'),
                            meta: { title: '期刊预定' }
                        }
                    ]
                },

                {
                    path: 'remember',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊记到', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/remember.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/periodical/remember/index.vue'),
                            meta: { title: '记到列表' }
                        },
                        {
                            path: 'info',
                            component: () => import('../components/views/periodical/remember/info.vue'),
                            meta: { title: '记到详情' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'binding',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊装订' },
                    icon: require('../assets/img/binding.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/periodical/binding/index.vue'),
                            meta: { title: '装订列表' }
                        },
                        {
                            path: 'index/info',
                            component: () => import('../components/views/periodical/binding/info.vue'),
                            meta: { title: '装订列表详情' },
                            hide: true
                        },
                        {
                            path: 'search',
                            component: () => import('../components/views/periodical/binding/search.vue'),
                            meta: { title: '装订查询' }
                        },
                        {
                            path: 'search/show',
                            component: () => import('../components/views/periodical/binding/show.vue'),
                            meta: { title: '装订列表详情' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'catalogue',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊编目', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/bian.png'),
                    children: [
                        {
                            path: 'library',
                            component: () => import('../components/views/periodical/catalogue/library.vue'),
                            meta: { title: '图书编目' }
                        },
                        {
                            path: 'library/libraryBookInfo',
                            component: () => import('../components/views/periodical/catalogue/libraryBookInfo.vue'),
                            meta: { title: '图书编目' },
                            hide: true
                        },
                        {
                            path: 'library/libraryInfo',
                            component: () => import('../components/views/periodical/catalogue/libraryInfo.vue'),
                            meta: { title: '图书编目' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'params',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '期刊参数', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerParameter.png'),
                    children: [
                        {
                            path: 'setting',
                            component: () => import('../components/views/periodical/params/setting.vue'),
                            meta: { title: '期刊设置' }
                        },
                        {
                            path: 'cycle',
                            component: () => import('../components/views/periodical/params/cycle.vue'),
                            meta: { title: '出版周期' }
                        }
                    ]
                },
                {
                    path: 'echart',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '报表统计' },
                    icon: require('../assets/img/echart.png'),
                    children: [
                        {
                            path: 'booking',
                            component: () => import('../components/views/periodical/echart/booking.vue'),
                            meta: { title: '预订单' }
                        },
                        {
                            path: 'bookingList',
                            component: () => import('../components/views/periodical/echart/bookingList.vue'),
                            meta: { title: '预订单列表' },
                            hide: true
                        },
                        {
                            path: 'remember',
                            component: () => import('../components/views/periodical/echart/remember.vue'),
                            meta: { title: '记到单' }
                        },
                        {
                            path: 'rememberList',
                            component: () => import('../components/views/periodical/echart/rememberList.vue'),
                            meta: { title: '记到单列表' },
                            hide: true
                        },

                        {
                            path: 'binding',
                            component: () => import('../components/views/periodical/echart/binding.vue'),
                            meta: { title: '装订单' }
                        },
                        {
                            path: 'bindingList',
                            component: () => import('../components/views/periodical/echart/bindingList.vue'),
                            meta: { title: '装订单列表' },
                            hide: true
                        },

                        {
                            path: 'catalogue',
                            component: () => import('../components/views/periodical/echart/catalogue.vue'),
                            meta: { title: '编目清单' }
                        },
                        {
                            path: 'catalogueList',
                            component: () => import('../components/views/periodical/echart/catalogueList.vue'),
                            meta: { title: '编目清单清单' },
                            hide: true
                        },

                        {
                            path: 'distribute',
                            component: () => import('../components/views/periodical/echart/distribute.vue'),
                            meta: { title: '分发清单' }
                        },
                        {
                            path: 'distributeList',
                            component: () => import('../components/views/periodical/echart/distributeList.vue'),
                            meta: { title: '分发清单列表' },
                            hide: true
                        },

                        {
                            path: 'books',
                            component: () => import('../components/views/periodical/echart/book.vue'),
                            meta: { title: '预订统计' }
                        },
                        {
                            path: 'bookList',
                            component: () => import('../components/views/periodical/echart/bookList.vue'),
                            meta: { title: '预订统计列表' },
                            hide: true
                        },

                        {
                            path: 'library',
                            component: () => import('../components/views/periodical/echart/library.vue'),
                            meta: { title: '到馆统计' }
                        },
                        {
                            path: 'libraryList',
                            component: () => import('../components/views/periodical/echart/libraryList.vue'),
                            meta: { title: '到馆统计列表' },
                            hide: true
                        },

                        {
                            path: 'bindings',
                            component: () => import('../components/views/periodical/echart/bindings.vue'),
                            meta: { title: '装订统计' }
                        },
                        {
                            path: 'bindingsList',
                            component: () => import('../components/views/periodical/echart/bindingsList.vue'),
                            meta: { title: '装订统计列表' },
                            hide: true
                        },

                        {
                            path: 'catalogues',
                            component: () => import('../components/views/periodical/echart/catalogues.vue'),
                            meta: { title: '编目统计' }
                        },
                        {
                            path: 'cataloguesList',
                            component: () => import('../components/views/periodical/echart/cataloguesList.vue'),
                            meta: { title: '编目统计列表' },
                            hide: true
                        }
                    ]
                }
            ]
        },
        // 子平台流通
        {
            path: '/circulation',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'circulation',
            meta: { title: '流通模块' },
            children: [
                {
                    path: 'manage',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '流通管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/circulationManage.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/circulation/manage/borrow.vue'),
                            meta: { title: '文献借还' }
                        },
                        {
                            path: 'browse',
                            component: () => import('../components/views/circulation/manage/browse.vue'),
                            meta: { title: '阅览管理' }
                        },
                        {
                            path: 'order',
                            component: () => import('../components/views/circulation/manage/order.vue'),
                            meta: { title: '文献预约' }
                        },
                        {
                            path: 'orderList',
                            component: () => import('../components/views/circulation/manage/orderList.vue'),
                            meta: { title: '预约管理' }
                        },
                        {
                            path: 'overdue',
                            component: () => import('../components/views/circulation/manage/overdue.vue'),
                            meta: { title: '超期催还' }
                        },
                        {
                            path: 'fines',
                            component: () => import('../components/views/circulation/manage/fines.vue'),
                            meta: { title: '罚款管理' }
                        }
                    ]
                },
                {
                    path: 'finance',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '财务管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/payInfo.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/circulation/finance/index.vue'),
                            meta: { title: '财务信息' }
                        },
                        // {
                        //     path: 'list',
                        //     component: () => import('../components/views/circulation/finance/list.vue'),
                        //     meta: { title: '财务清单' },
                        // },
                        // {
                        //     path: 'list/listInfo',
                        //     component: () => import('../components/views/circulation/finance/listInfo.vue'),
                        //     meta: { title: '财务清单预览' },
                        //     hide:true
                        // },
                        {
                            path: 'statistic',
                            component: () => import('../components/views/circulation/finance/statistic.vue'),
                            meta: { title: '财务统计' }
                        },
                        {
                            path: 'statistic/statisticList',
                            component: () => import('../components/views/circulation/finance/statisticList.vue'),
                            meta: { title: '财务统计预览' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'reader',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '读者管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/circulationReader.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/circulation/reader/index.vue'),
                            meta: { title: '读者库' }
                        },
                        {
                            path: 'index/addReader',
                            component: () => import('../components/views/circulation/reader/addReader.vue'),
                            meta: { title: '读者库' },
                            hide: true
                        },
                        {
                            path: 'index/prantUser',
                            component: () => import('../components/views/circulation/reader/prantUser.vue'),
                            meta: { title: '读者打印' },
                            hide: true
                        },
                        {
                            path: 'unit',
                            component: () => import('../components/views/circulation/reader/unit.vue'),
                            meta: { title: '读者单位管理' }
                        },
                        {
                            path: 'class',
                            component: () => import('../components/views/circulation/class/class.vue'),
                            meta: { title: '批量换班' }
                        },
                        {
                            path: 'upLoadRead',
                            component: () => import('../components/views/circulation/upLoadRead/index.vue'),
                            meta: { title: '读者导入' }
                        }
                    ]
                },
                {
                    path: 'booking',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '借阅查询', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerRetrieval.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/circulation/booking/index.vue'),
                            meta: { title: '当前借阅查询' }
                        },
                        {
                            path: 'history',
                            component: () => import('../components/views/circulation/booking/history.vue'),
                            meta: { title: '历史借阅查询' }
                        }
                    ]
                },
                {
                    path: 'parameter',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '流通参数', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/cataloguerParameter.png'),
                    children: [
                        {
                            path: 'readerType',
                            component: () => import('../components/views/circulation/parameter/readerType.vue'),
                            meta: { title: '读者类型' }
                        },
                        {
                            path: 'readerType/addReaderType',
                            component: () => import('../components/views/circulation/parameter/addReaderType.vue'),
                            meta: { title: '读者类型' },
                            hide: true
                        },
                        {
                            path: 'literatureType',
                            component: () => import('../components/views/circulation/parameter/literatureType.vue'),
                            meta: { title: '文献流通类型' }
                        },
                        {
                            path: 'rule',
                            component: () => import('../components/views/circulation/parameter/rule.vue'),
                            meta: { title: '流通规则' }
                        },
                        {
                            path: 'rule/addRule',
                            component: () => import('../components/views/circulation/parameter/addRule.vue'),
                            meta: { title: '特殊流通规则' },
                            hide: true
                        },
                        {
                            path: 'vacation',
                            component: () => import('../components/views/circulation/parameter/vacation.vue'),
                            meta: { title: '假期设置' }
                        }
                    ]
                },
                {
                    path: 'report',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '报表统计', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/echart.png'),
                    children: [
                        {
                            path: 'readList',
                            component: () => import('../components/views/circulation/report/readList.vue'),
                            meta: { title: '读者清单' }
                        },
                        {
                            path: 'readLists',
                            component: () => import('../components/views/circulation/report/readLists.vue'),
                            meta: { title: '读者清单列表' },
                            hide: true
                        },
                        {
                            path: 'reader',
                            component: () => import('../components/views/circulation/report/reader.vue'),
                            meta: { title: '读者统计' }
                        },
                        {
                            path: 'readerList',
                            component: () => import('../components/views/circulation/report/readerList.vue'),
                            meta: { title: '读者统计列表' },
                            hide: true
                        },
                        {
                            path: 'appointment',
                            component: () => import('../components/views/circulation/report/appointment.vue'),
                            meta: { title: '预约清单' }
                        },
                        {
                            path: 'appointmentList',
                            component: () => import('../components/views/circulation/report/appointmentList.vue'),
                            meta: { title: '预约清单列表' },
                            hide: true
                        },
                        {
                            path: 'category',
                            component: () => import('../components/views/circulation/report/category.vue'),
                            meta: { title: '预约类别' }
                        },
                        {
                            path: 'categoryList',
                            component: () => import('../components/views/circulation/report/categoryList.vue'),
                            meta: { title: '预约类别统计列表' },
                            hide: true
                        },
                        {
                            path: 'reading',
                            component: () => import('../components/views/circulation/report/reading.vue'),
                            meta: { title: '阅览清单' }
                        },
                        {
                            path: 'readingList',
                            component: () => import('../components/views/circulation/report/readingList.vue'),
                            meta: { title: '阅览清单列表' },
                            hide: true
                        },
                        {
                            path: 'readStatistics',
                            component: () => import('../components/views/circulation/report/readStatistics.vue'),
                            meta: { title: '阅览统计' }
                        },
                        {
                            path: 'readStatisticsList',
                            component: () => import('../components/views/circulation/report/readStatisticsList.vue'),
                            meta: { title: '阅览统计列表' },
                            hide: true
                        },
                        {
                            path: 'bookBorrow',
                            component: () => import('../components/views/circulation/report/bookBorrow.vue'),
                            meta: { title: '文献借阅清单' }
                        },
                        {
                            path: 'bookBorrowList',
                            component: () => import('../components/views/circulation/report/bookBorrowList.vue'),
                            meta: { title: '文献借阅清单列表' },
                            hide: true
                        },
                        {
                            path: 'typeBorrow',
                            component: () => import('../components/views/circulation/report/typeBorrow.vue'),
                            meta: { title: '类别借阅统计' }
                        },
                        {
                            path: 'typeBorrowList',
                            component: () => import('../components/views/circulation/report/typeBorrowList.vue'),
                            meta: { title: '类别借阅统计列表' },
                            hide: true
                        },
                        {
                            path: 'borrowRanking',
                            component: () => import('../components/views/circulation/report/borrowRanking.vue'),
                            meta: { title: '文献借阅排行' }
                        },
                        {
                            path: 'synthesizeSta',
                            component: () => import('../components/views/circulation/report/synthesizeSta.vue'),
                            meta: { title: '借阅综合统计' }
                        },
                        {
                            path: 'borrowRankingList',
                            component: () => import('../components/views/circulation/report/borrowRankingList.vue'),
                            meta: { title: '文献借阅排行列表' },
                            hide: true
                        },
                        {
                            path: 'readRanking',
                            component: () => import('../components/views/circulation/report/readRanking.vue'),
                            meta: { title: '读者阅读排行' }
                        },
                        {
                            path: 'readRankingList',
                            component: () => import('../components/views/circulation/report/readRankingList.vue'),
                            meta: { title: '读者阅读排行列表' },
                            hide: true
                        }
                        // {
                        //     path: 'set',
                        //     component: () => import('../components/views/circulation/report/page/set.vue'),
                        //     meta: { title: '预约清单设置' },
                        //     hide:true
                        // },
                    ]
                }
            ]
        },
        // 子平台OPAC
        {
            path: '/opac',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            icon: 'el-icon-lx-home',
            name: 'opac',
            meta: { title: 'OPAC模块' },
            children: [
                {
                    path: 'bookCover',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '图书封面', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/bookFace.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/opac/bookCover/index.vue'),
                            meta: { title: '列表' }
                        }
                    ]
                },
                // {
                //     path: 'notice',
                //     component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                //     meta: { title: '馆内内容设置', icon: 'el-icon-lx-copy' },
                //     icon: require('../assets/img/info.png'),
                //     children: [
                //         {
                //             path: 'index',
                //             component: () => import('../components/views/opac/notice/index.vue'),
                //             meta: { title: '馆内公告' },
                //         },
                //         {
                //             path: 'index/addNote',
                //             component: () => import('../components/views/opac/notice/addNote.vue'),
                //             meta: { title: '新增公告' },
                //             hide:true
                //         }
                //     ]
                // },
                {
                    path: 'recommend',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '图书推荐', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/clo.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/opac/recommend/index.vue'),
                            meta: { title: '列表' }
                        },
                        {
                            path: 'index/add',
                            component: () => import('../components/views/opac/recommend/add.vue'),
                            meta: { title: '新增' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'OPAC',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '馆内内容设置', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/msg.png'),
                    children: [
                        // {
                        //     path: 'hot',
                        //     component: () => import('../components/views/opac/notice/hot.vue'),
                        //     meta: { title: '热门搜索' },
                        // },
                        {
                            path: 'index',
                            component: () => import('../components/views/opac/notice/index.vue'),
                            meta: { title: '馆内公告' }
                        },
                        {
                            path: 'index/addNote',
                            component: () => import('../components/views/opac/notice/addNote.vue'),
                            meta: { title: '馆内公告' },
                            hide: true
                        },
                        {
                            path: 'out',
                            component: () => import('../components/views/opac/notice/out.vue'),
                            meta: { title: '馆内制度' }
                        },
                        {
                            path: 'out/addNote',
                            component: () => import('../components/views/opac/notice/outAdd.vue'),
                            meta: { title: '馆内公告' },
                            hide: true
                        }
                    ]
                },
                {
                    path: 'examine',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '审核管理', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/checked.png'),
                    children: [
                        {
                            path: 'recommend',
                            component: () => import('../components/views/opac/examine/recommend.vue'),
                            meta: { title: '读者荐购' }
                        },
                        {
                            path: 'comment',
                            component: () => import('../components/views/opac/examine/comment.vue'),
                            meta: { title: '读者评论' }
                        },
                        {
                            path: 'complaint',
                            component: () => import('../components/views/opac/examine/complaint.vue'),
                            meta: { title: '读者投诉管理' }
                        },
                        {
                            path: 'accreditation',
                            component: () => import('../components/views/opac/examine/accreditation.vue'),
                            meta: { title: '微信扫码办证' }
                        }
                    ]
                },
                // {
                //     path: 'echart',
                //     component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                //     meta: { title: '数据统计', icon: 'el-icon-lx-copy' },
                //     icon: require('../assets/img/echart.png'),
                //     children: [
                //         {
                //             path: 'index',
                //             component: () => import('../components/views/opac/notice/index.vue'),
                //             meta: { title: '列表' },
                //         }
                //     ]
                // },
                {
                    path: 'link',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: '站外链接设置', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/url.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/opac/link/index.vue'),
                            meta: { title: '列表' }
                        }
                    ]
                },
                {
                    path: 'setting',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/views/block.vue'),
                    meta: { title: 'OPAC设置', icon: 'el-icon-lx-copy' },
                    icon: require('../assets/img/default.png'),
                    children: [
                        {
                            path: 'index',
                            component: () => import('../components/views/opac/setting/index.vue'),
                            meta: { title: 'logo设置' }
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            icon: 'el-icon-lx-home', //一定要改回 Login.vue
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/loginAlone',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/loginAlone.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/loginAll',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/loginAll.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/singleVisionLogin',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/singleVisionLogin.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/activationSelect',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/personal/activationSelect.vue'),
            meta: { title: '激活' }
        },
        {
            path: '/activationOL',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/personal/activation.vue'),
            meta: { title: '激活账号' }
        },
        {
            path: '/activation',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/personal/activation.vue'),
            meta: { title: '激活账号' }
        },
        {
            path: '/print',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/print/print.vue'),
            meta: { title: '打印' }
        },
        {
            path: '/printCom',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/print/printCom.vue'),
            meta: { title: '打印' }
        },
        {
            path: '/print/new',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/print/prints.vue'),
            meta: { title: '打印' }
        },
        {
            path: '/print/news',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/views/print/printes.vue'),
            meta: { title: '打印' }
        },
        {
            path: '/doc',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/common/doc.vue'),
            meta: { title: '文档' }
        },
        {
            path: '/printClass',
            component: () => import('../components/views/colony/classification/printClass.vue'),
            meta: { title: '分类统计打印', keepAlive: true },
            hide: true
        },
        {
            path: '/404',
            // redirect: '/login',
            icon: 'el-icon-lx-home',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/404.vue'),
            meta: { title: '404' }
        },
        {
            path: '*',
            icon: 'el-icon-lx-home',
            redirect: '/404',
            meta: { title: '404' }
        }
    ]
});
