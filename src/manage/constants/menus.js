export const menus = [
    { key: '/index', title: '首页', icon: 'home', },
    { key: '/user', title: '用户管理', icon: 'user', },
    {
        key: '/role', title: '权限管理', icon: 'idcard',
        sub: [
            { key: '/role/role', title: '角色管理', icon: 'user', },
            { key: '/role/permission', title: '权限管理', icon: 'audit', },
        ],
    },
    { key: '/area', title: '地区管理', icon: 'environment', },
    {
        key: '/football', title: '球赛管理', icon: 'dribbble',
        sub: [
            { key: '/football/footballLeagueMatch', title: '联赛', icon: 'trophy', },
            { key: '/football/footballMatch', title: '球赛', icon: 'dribbble', },
            { key: '/football/footballTeam', title: '球队', icon: 'team', },
            { key: '/football/footballPlayer', title: '球员', icon: 'user', },
            { key: '/football/import', title: '导入', icon: 'import', },
        ],
    },
    {
        key: '/pay', title: '交易管理', icon: 'dollar',
        sub: [
            { key: '/pay/order', title: '订单管理', icon: 'shopping-cart', },
            { key: '/pay/product', title: '产品管理', icon: 'shopping', },
            { key: '/monopoly', title: '比赛买断', icon: 'money-collect', },
            { key: '/freeTicket', title: '免费观看', icon: 'transaction', },
        ],
    },
    { key: '/live', title: '直播管理', icon: 'video-camera', },
    { key: '/setting', title: '设置', icon: 'setting',
        sub: [
            { key: '/setting/banner', title: '轮播图', icon: 'picture', },
            { key: '/setting/bulletin', title: '广告/公告', icon: 'notification', },
            { key: '/setting/scoreboard', title: '比分牌', icon: 'table', },
            // { key: '/setting/wechat', title: '小程序', icon: 'wechat', },
        ],
    },
];