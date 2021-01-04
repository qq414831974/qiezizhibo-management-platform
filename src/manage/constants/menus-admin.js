export const menus_admin = [
    {key: '/index', title: '首页', icon: 'home', public: 1},
    {
        key: '/user', title: '用户管理', icon: 'user',
        public: 1,
        sub: [
            {key: '/user/user', title: '用户管理', icon: 'user',},
            {key: '/user/admin', title: '后台用户管理', icon: 'crown',},
        ]

    },
    {
        key: '/role', title: '权限管理', icon: 'idcard',
        public: 1,
        sub: [
            {key: '/role/role', title: '角色管理', icon: 'user',},
            {key: '/role/permission', title: '权限管理', icon: 'audit',},
        ],
    },
    {
        key: '/exp', title: '经验系统', icon: 'thunderbolt',
        public: 1,
        sub: [
            {key: '/exp/exp', title: '经验系统', icon: 'thunderbolt',},
            {key: '/exp/growth', title: '充值成长', icon: 'property-safety',},
        ]
    },
    {key: '/area', title: '地区管理', icon: 'environment',},
    {
        key: '/football', title: '球赛管理', icon: 'dribbble',
        public: 1,
        sub: [
            {key: '/football/footballLeagueMatch', title: '联赛', icon: 'trophy',},
            {key: '/football/footballMatch', title: '球赛', icon: 'dribbble',},
            {key: '/football/footballTeam', title: '球队', icon: 'team',},
            {key: '/football/footballPlayer', title: '球员', icon: 'user',},
            {key: '/football/import', title: '导入', icon: 'import',},
        ],
    },
    {
        key: '/pay', title: '交易管理', icon: 'dollar',
        public: 1,
        sub: [
            {key: '/pay/order', title: '订单管理', icon: 'shopping-cart',},
            {key: '/pay/product', title: '产品管理', icon: 'shopping',},
            {key: '/pay/monopoly', title: '比赛买断', icon: 'money-collect',},
            {key: '/pay/freeTicket', title: '免费观看', icon: 'transaction',},
            {key: '/pay/gift', title: '礼物管理', icon: 'gift',},
            {key: '/pay/bet', title: '竞猜管理', icon: 'dribbble',},
            {key: '/pay/deposit', title: '余额管理', icon: 'dollar',},
        ],
    },
    {key: '/live', title: '直播管理', icon: 'video-camera',},
    {
        key: '/setting', title: '设置', icon: 'setting',
        public: 1,
        sub: [
            {key: '/setting/banner', title: '轮播图', icon: 'picture',},
            {key: '/setting/bulletin', title: '广告/公告', icon: 'notification',},
            {key: '/setting/scoreboard', title: '比分牌', icon: 'table',},
            {key: '/setting/sharesentence', title: '分享语句', icon: 'share-alt',},
            // { key: '/setting/wechat', title: '小程序', icon: 'wechat', },
        ],
    },
];