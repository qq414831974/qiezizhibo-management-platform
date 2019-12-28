export const menus = [
    {key: '/index', title: '首页', icon: 'home',},
    {key: '/football/footballLeagueMatch', title: '联赛管理', icon: 'trophy',},
    {key: '/football/footballMatch', title: '球赛管理', icon: 'dribbble',},
    {key: '/football/footballTeam', title: '球队管理', icon: 'team',},
    {key: '/football/footballPlayer', title: '球员管理', icon: 'user',},
    {key: '/live', title: '直播管理', icon: 'video-camera',},
    {
        key: '/setting', title: '设置', icon: 'setting',
        sub: [
            {key: '/setting/banner', title: '轮播图', icon: 'picture',},
            {key: '/setting/bulletin', title: '公告栏', icon: 'notification',},
        ],
    },
];