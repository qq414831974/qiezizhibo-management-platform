import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, Row, Col} from 'antd';
import {
    getUserLeagueMemberList, addUserLeagueMember, deleteUserLeagueMember
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import defultAvatar from "../../../../static/avatar.jpg";
import copy from "copy-to-clipboard/index";
import UserLeagueMemberAddDialog from "./UserLeagueMemberAddDialog";
import {getQueryString} from "../../../../utils";

class UserLeagueMemberTable extends React.Component {
    state = {
        data: [],
        pagination: {
            pageSize: getQueryString(this.props.location ? this.props.location.search : "", "toolbox") ? 5 : 10,
            filters: getQueryString(this.props.location ? this.props.location.search : "", "toolbox") ? {sourceType: 2} : {}
        },
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
            ...this.state.pagination.filters,
        });
    };

    fetch = (params) => {
        this.getUserLeagueMemberList(params)
    }
    getUserLeagueMemberList = (params) => {
        this.setState({loading: true});
        getUserLeagueMemberList({leagueId: this.props.leagueId, ...params}).then((data) => {
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
                message.error('获取联赛会员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        pager.filters = pager.filters || {};
        if (searchText != null && searchText != '') {
            pager.filters["userName"] = searchText;
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
        copy(record.userNo);
        message.success('用户id已复制', 1);
        if (record && record.sourceType == 2) {
            this.setState({deleteId: record.id})
            this.handleDeleteClick();
        }
    }
    onOrderClick = (record, e) => {
        copy(record.orderId);
        message.success('订单号已复制', 1);
    }
    onAddUserLeagueMemberClick = () => {
        this.setState({addUserLeagueMemberShow: true});
    }
    onAddUserLeagueMemberCancel = () => {
        this.setState({addUserLeagueMemberShow: false});
    }
    saveAddDialogRef = (form) => {
        this.formAdd = form;
    }
    onAddUserLeagueMemberCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addUserLeagueMember(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.error('添加失败', 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({addUserLeagueMemberShow: false});
        });
    }
    handleDeleteClick = () => {
        this.setState({deleteVisible: true})
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false})
    }
    handleDeleteOK = () => {
        deleteUserLeagueMember({id: this.state.deleteId}).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    render() {
        const onNameClick = this.onNameClick;
        const onOrderClick = this.onOrderClick;
        const AddDialog = Form.create()(UserLeagueMemberAddDialog);
        const isMobile = this.props.responsive.data.isMobile;
        const isToolbox = getQueryString(this.props.location ? this.props.location.search : "", "toolbox");

        let columns = [{
            title: '用户',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '30%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按用户名搜索"
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
                if (record.user) {
                    const user = record.user;
                    return <div className="center"><Avatar src={user && user.avatar ? user.avatar : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>{user ? user.name : "未知"}</a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '订单号',
            key: 'orderId',
            dataIndex: 'orderId',
            width: '25%',
            align: 'center',
            render: function (text, record, index) {
                if (record.sourceType == 0) {
                    return <a className="ml-s" onClick={onOrderClick.bind(this, record)}>{record.orderId}</a>;
                } else if (record.sourceType == 1) {
                    return <span className="ml-s">v-{record.leagueId}{record.id}</span>;
                }
                return <a className="ml-s" onClick={onOrderClick.bind(this, record)}>{record.orderId}</a>;
            },
        }, {
            title: '来源',
            key: 'sourceType',
            dataIndex: 'sourceType',
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                let source = "未知";
                switch (record.sourceType) {
                    case 0:
                        source = "购买";
                        break;
                    case 1:
                        source = "球员验证";
                        break;
                    case 2:
                        source = "联系验证";
                        break;
                }
                return <span>{source}</span>;
            },
        }, {
            title: '过期时间',
            dataIndex: 'expireTime',
            key: 'expireTime',
            align: 'center',
            width: '30%',
        }
        ];
        if (isToolbox) {
            columns = [{
                title: '用户',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: '35%',
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="按用户名搜索"
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
                    if (record.user) {
                        const user = record.user;
                        return <div className="center"><Avatar src={user && user.avatar ? user.avatar : logo}/>
                            <a className="ml-s"
                               onClick={onNameClick.bind(this, record)}>{user ? user.name : "未知"}</a>
                        </div>;
                    }
                    return <span>未知</span>;
                }
            }, {
                title: '联赛',
                dataIndex: 'leagueId',
                key: 'leagueId',
                align: 'center',
                width: '35%',
                render: function (text, record, index) {
                    if (record.league) {
                        const league = record.league;
                        return <div className="center"><Avatar src={league && league.headImg ? league.headImg : logo}/>
                            <a className="ml-s"
                               onClick={onNameClick.bind(this, record)}>{league ? (league.shortName ? league.shortName : league.name) : "未知"}</a>
                        </div>;
                    }
                    return <span>未知</span>;
                }
            }, {
                title: '过期时间',
                dataIndex: 'expireTime',
                key: 'expireTime',
                align: 'center',
                width: '30%',
            }]
        }

        return <div>
            <Table columns={columns}
                   rowKey={record => record.id}
                   dataSource={this.state.data}
                   loading={this.state.loading}
                   bordered
                   pagination={this.state.pagination}
                   onChange={this.handleTableChange}
                   title={() =>
                       <div style={{height: 32}}>
                           <Tooltip title="添加">
                               <Button type="primary" shape="circle" icon="plus"
                                       loading={this.state.loading}
                                       onClick={this.onAddUserLeagueMemberClick}/>
                           </Tooltip>
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
                title="添加联赛会员"
                visible={this.state.addUserLeagueMemberShow}
                destroyOnClose
                footer={[
                    <Button key="back" onClick={this.onAddUserLeagueMemberCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.onAddUserLeagueMemberCreate}>确定</Button>,
                ]}
                onCancel={this.onAddUserLeagueMemberCancel}>
                <AddDialog
                    isToolbox={isToolbox}
                    leagueId={this.props.leagueId}
                    visible={this.state.addUserLeagueMemberShow}
                    ref={this.saveAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.handleDeleteOK}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLeagueMemberTable);