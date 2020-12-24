export const menus = [
    {key: '/index', title: '首页', icon: 'home',},
    {
        key: '/football', title: '球赛管理', icon: 'dribbble',
        sub: [
            {key: '/football/footballLeagueMatch', title: '联赛', icon: 'trophy',},
            {key: '/football/footballMatch', title: '球赛', icon: 'dribbble',},
            {key: '/football/footballTeam', title: '球队', icon: 'team',},
            {key: '/football/footballPlayer', title: '球员', icon: 'user',},
            {key: '/football/import', title: '导入', icon: 'import',},
        ],
    },
];