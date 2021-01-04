import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar} from 'antd';
import {getUserBets, updateUserBet} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import UserBetModifyDialog from './UserBetModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../static/logo.png";
import defultAvatar from "../../../static/avatar.jpg";
import {parseTimeString} from "../../../utils";

class UserBetTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        if (this.props.leagueId != null) {
            this.setState({pagination: {pageSize: 10, filters: {leagueId: this.props.leagueId}}});
            this.fetch({
                pageSize: this.state.pagination.pageSize,
                pageNum: this.props.page ? this.props.page : 1,
                leagueId: this.props.leagueId
            });
        } else if (this.props.matchId != null) {
            this.setState({pagination: {pageSize: 10, filters: {matchId: this.props.matchId}}});
            this.fetch({
                pageSize: this.state.pagination.pageSize,
                pageNum: this.props.page ? this.props.page : 1,
                matchId: this.props.matchId
            });
        } else {
            this.fetch({
                pageSize: this.state.pagination.pageSize,
                pageNum: this.props.page ? this.props.page : 1,
            });
        }
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getUserBets(params).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取用户竞猜列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
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
        this.setState({selectedRowKeys: []});
    }
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onSearch = () => {
        const {searchText, filterType} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText || filterType != null,
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
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showUserBetModifyDialog();
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        pager.filters = this.getTableFilters(pager, filters);
        this.props.switchPage(pager.current);
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
        const {searchText, filterType} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["userName"] = searchText;
        }
        if (filterType != null) {
            pager.filters["status"] = filterType;
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
    saveUserBetModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showUserBetModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleUserBetModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleUserBetModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateUserBet(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    onNameDropDownRadioChange = (e) => {
        this.setState({
            filterType: e.target.value,
        });
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const ModifyDialog = Form.create()(UserBetModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: 'id',
            key: 'id',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按用户名字搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={-1}>已竞猜，未出赛果</Radio>
                            <Radio value={0}>竞猜失败</Radio>
                            <Radio value={1}>未发奖</Radio>
                            <Radio value={2}>已发奖</Radio>
                            <Radio value={3}>放弃领奖</Radio>
                            <Radio value={4}>竞猜取消</Radio>
                        </Radio.Group>
                    </div>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        }, {
            title: '用户id',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '20%',
            render: function (text, record, index) {
                if (record.user) {
                    return <div className="center"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.user.name}</a></div>;
                }
                return <span>{record.userNo}</span>;
            },
        },
            {
                title: '比赛',
                key: 'matchId',
                dataIndex: 'matchId',
                align: 'center',
                width: '25%',
                render: function (text, record, index) {
                    if (record.match) {
                        const match = record.match;
                        const hostteam = match.hostteam;
                        const guestteam = match.guestteam;
                        if (hostteam == null || guestteam == null) {
                            return <Tooltip title={`比赛时间：${match.startTime}`}><span>{match.name}</span></Tooltip>
                        }
                        return <Tooltip title={`比赛时间：${match.startTime}`}>
                            <div className="center">
                                <Avatar src={hostteam.headImg ? hostteam.headImg : defultAvatar}/>
                                <p className="ml-s">{hostteam.name}</p>
                                <p className="ml-s mr-s">VS</p>
                                <Avatar src={guestteam.headImg ? guestteam.headImg : defultAvatar}/>
                                <p className="ml-s">{guestteam.name}</p>
                            </div>
                        </Tooltip>;
                    }
                    return <span>未知</span>;
                },
            },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                render: function (text, record, index) {
                    let status = "未知"
                    if (record.status) {
                        switch (record.status) {
                            case -1:
                                status = "已竞猜，未出赛果"
                                break;
                            case 0:
                                status = "竞猜失败"
                                break;
                            case 1:
                                status = "未发奖"
                                break;
                            case 2:
                                status = "已发奖"
                                break;
                            case 3:
                                status = "放弃领奖"
                                break;
                            case 4:
                                status = "竞猜取消"
                                break;
                        }
                    }
                    return <span>{status}</span>;
                },
            },
            {
                title: '档位',
                key: 'grade',
                dataIndex: 'grade',
                align: 'center',
                width: '5%',
                render: function (text, record, index) {
                    if (record.gradeInfo) {
                        let gradeInfoDom = <div>
                            <div>档位:{record.gradeInfo.grade}</div>
                            <div>价格:{record.gradeInfo.price / 100}元</div>
                            {record.gradeInfo.award ? <div>奖品:{record.gradeInfo.award}</div> :
                                <div>奖品:{record.gradeInfo.awardDeposit/100}茄币</div>}
                        </div>;
                        return <Tooltip title={gradeInfoDom}><span>{record.grade}</span></Tooltip>;
                    }
                    return <span>{record.grade}</span>;
                },
            },
            {
                title: '投注',
                key: 'score',
                dataIndex: 'score',
                align: 'center',
                width: '6%',
            },
            {
                title: '赛果',
                key: 'score',
                dataIndex: 'score',
                align: 'center',
                width: '6%',
                render: function (text, record, index) {
                    if (record.match) {
                        return <div className="center">
                            {record.match.score}
                        </div>;
                    }
                    return <span>未知</span>;
                },
            },
            {
                title: '下注时间',
                align: 'center',
                dataIndex: 'betTime',
                width: '13%',
                render: function (text, record, index) {
                    return <p>{(record.betTime ? parseTimeString(record.betTime) : "-")}</p>
                }
            },
            {
                title: '竞猜方式',
                key: 'type',
                dataIndex: 'type',
                align: 'center',
                width: '5%',
                render: function (text, record, index) {
                    let statusString = "收费竞猜"
                    switch (record.type) {
                        case 0:
                            statusString = "免费竞猜"
                            break;
                        case 1:
                            statusString = "收费竞猜"
                            break;
                    }
                    return <span>{statusString}</span>;
                },
            },
        ];
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                           bordered
                           title={() =>
                               <div style={{minHeight: 32}}>
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
                title="修改用户竞猜"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="back" onClick={this.handleUserBetModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleUserBetModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleUserBetModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveUserBetModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserBetTable);