import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar} from 'antd';
import {getLeaguePlayerHeat, getLeagueTeamHeat, addLeaguePlayerHeat, addLeagueTeamHeat} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import LeagueHeatAddDialog from './LeagueHeatAddDialog';
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import defultAvatar from "../../../../static/avatar.jpg";


class LeagueHeatTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params) => {
        if (this.props.heatRule && this.props.heatRule.type == 2) {
            this.getLeaguePlayerHeat({leagueId: this.props.leagueId, ...params});
        } else if (this.props.heatRule && this.props.heatRule.type == 3) {
            this.getLeagueTeamHeat({leagueId: this.props.leagueId, ...params});
        }
    }
    getLeaguePlayerHeat = (params) => {
        this.setState({loading: true});
        getLeaguePlayerHeat(params).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                });
            } else {
                message.error('获取比赛球员热度列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getLeagueTeamHeat = (params) => {
        this.setState({loading: true});
        getLeagueTeamHeat(params).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                });
            } else {
                message.error('获取比赛球队热度列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        pager.filters = this.getTableFilters(pager, filters);
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    getTableFilters = (pager, filters) => {
        const {searchText} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["name"] = searchText;
        }
        if (filters) {
            for (let param in filters) {
                if (filters[param] != null && (filters[param] instanceof Array && filters[param].length > 0)) {
                    pager.filters[param] = filters[param][0];
                }
            }
        }
        return pager.filters;
    }
    refresh = () => {
        const pager = {...this.state.pagination};
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onSearch = () => {
        const {searchText} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: 1,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    onNameClick = (record, e) => {
        let target = null
        if (this.props.heatRule && this.props.heatRule.type == 2) {
            target = this.getPlayer(record.player);
        }else if(this.props.heatRule && this.props.heatRule.type == 3) {
            target = this.getTeam(record.team);
        }
        this.setState({record: record, heatRule: this.props.heatRule, target: target});
        this.showLeagueHeatAddDialog();
    }
    saveLeagueHeatAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showLeagueHeatAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleLeagueHeatAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };

    handleLeagueHeatAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (this.props.heatRule && this.props.heatRule.type == 2) {
                this.addPlayerHeat(values.leagueId, values.playerId, values.heat);
            }else if (this.props.heatRule && this.props.heatRule.type == 3) {
                this.addTeamHeat(values.leagueId, values.teamId, values.heat);
            }
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    addPlayerHeat = (leagueId, playerId, heat) => {
        addLeaguePlayerHeat({leagueId, playerId, heat}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('添加成功', 3);
                }
            } else {
                message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    addTeamHeat = (leagueId, teamId, heat) => {
        addLeagueTeamHeat({leagueId, teamId, heat}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('添加成功', 3);
                }
            } else {
                message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getPlayer = (player) => {
        if (player == null) {
            return {};
        }
        return player;
    }
    getTeam = (team) => {
        if (team == null) {
            return {};
        }
        return team;
    }

    render() {
        const onNameClick = this.onNameClick;

        const AddDialog = Form.create()(LeagueHeatAddDialog);
        const getPlayer = this.getPlayer;
        const getTeam = this.getTeam;

        const isMobile = this.props.responsive.data.isMobile;


        const columns = [{
            title: '球队/球员',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '70%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            render: function (text, record, index) {
                if (record.playerId) {
                    const player = getPlayer(record.player);
                    return <div className="center"><Avatar src={player && player.headImg ? player.headImg : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>{player ? `${player.name}(${record.sequence}号)` : "未知"}</a>
                    </div>;
                }
                if (record.teamId) {
                    const team = getTeam(record.team);
                    return <div className="center"><Avatar src={team && team.headImg ? team.headImg : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>{team ? `${team.name}` : "未知"}</a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '热度',
            key: 'heat',
            dataIndex: 'heat',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.heat + record.heatBase}</a>;
            },
        },
        ];
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           loading={this.state.loading}
                           bordered
                           pagination={this.state.pagination}
                           onChange={this.handleTableChange}
                           title={() =>
                               <div style={{height: 32}}>
                                   <Tooltip title="刷新">
                                       <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加热度"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleLeagueHeatAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleLeagueHeatAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleLeagueHeatAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           record={this.state.record}
                           target={this.state.target}
                           heatRule={this.props.heatRule}
                           ref={this.saveLeagueHeatAddDialogRef}/>
            </Modal>
        </div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueHeatTable);