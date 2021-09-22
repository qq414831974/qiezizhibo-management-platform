import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Row, Col, Avatar} from 'antd';
import {getCashOrders, queryCashOrder,} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import CashOrderModifyDialog from './CashOrderModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import defultAvatar from "../../../static/avatar.jpg";
import NP from 'number-precision'

const InputGroup = Input.Group;

class CashOrderTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getCashOrders(params).then((data) => {
            if (data && data.code == 200 && data.data && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                });
            } else {
                message.error('获取订单列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    }
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onInputUserChange = (e) => {
        this.setState({searchUser: e.target.value});
    }
    onSearch = () => {
        const {searchText, searchUser, filterStatus} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filterUserDropdownVisible: false,
            filtered: !!searchText || filterStatus != null,
            filteredUser: !!searchUser,
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
        this.setState({record: record});
        this.showCashOrderModifyDialog();
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "desc";
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
        const {searchText, searchUser, filterStatus} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["id"] = searchText;
        }
        if (filterStatus != null) {
            pager.filters["cashStatus"] = filterStatus;
        }
        if (searchUser != null && searchUser != '') {
            pager.filters["userRealName"] = searchUser;
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
    saveCashOrderModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showCashOrderModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleOrderModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    onNameDropDownRadioChange = (e) => {
        this.setState({
            filterStatus: e.target.value,
        });
    }
    handleOrderUpdateClick = () => {
        queryCashOrder(this.state.record.id).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({dialogModifyVisible: false})
                    this.refresh();
                    message.success('更新成功', 1);
                }
            } else {
                message.error('更新失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    toMatch = (item) => {
        const history = this.props.history;
        history.push(`/football/footballMatch/${item.id}`);
    }
    toLeague = (item) => {
        const history = this.props.history;
        history.push(`/football/footballLeagueMatch/${item.id}`);
    }

    render() {
        const onNameClick = this.onNameClick;
        const toMatch = this.toMatch;
        const toLeague = this.toLeague;

        const ModifyDialog = Form.create()(CashOrderModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: '订单号',
            key: 'id',
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
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterStatus}>
                            <Radio value={-1}>已创建</Radio>
                            <Radio value={0}>处理中</Radio>
                            <Radio value={1}>成功</Radio>
                            <Radio value={2}>重试中</Radio>
                            <Radio value={3}>失败</Radio>
                            <Radio value={4}>关闭</Radio>
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
            width: '25%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        }, {
            title: '用户',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '25%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchUserInput = ele}
                        placeholder="搜索"
                        value={this.state.searchUser}
                        onChange={this.onInputUserChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filteredUser ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterUserDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterUserDropdownVisible: visible,
                }, () => this.searchUserInput && this.searchUserInput.focus());
            },
            render: function (text, record, index) {
                return <div className="w-full center">
                    <Avatar src={record.user && record.user.avatar ? record.user.avatar : defultAvatar}/>
                    <p className="ml-s">{record.user && record.user.name ? record.user.name : "用户"}</p>
                </div>;
            },
        }, {
            title: '状态',
            key: 'cashStatus',
            dataIndex: 'cashStatus',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let statusString = "已创建"
                switch (record.cashStatus) {
                    case -1:
                        statusString = "已创建"
                        break;
                    case 0:
                        statusString = "处理中"
                        break;
                    case 1:
                        statusString = "成功"
                        break;
                    case 2:
                        statusString = "重试中"
                        break;
                    case 3:
                        statusString = "失败"
                        break;
                    case 4:
                        statusString = "关闭"
                        break;
                }
                return <span>{statusString}</span>;
            },
        }, {
            title: '金额（元）',
            key: 'cashOut',
            dataIndex: 'cashOut',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                if (record.cashOut) {
                    return <span className="ml-s">
                        {NP.divide(record.cashOut, 100)}
                    </span>;
                }
                return "-";
            },
        }, {
            title: '创建时间',
            key: 'cashOutCreateTime',
            dataIndex: 'cashOutCreateTime',
            align: 'center',
            width: '15%',
        }, {
            title: '确认时间',
            key: 'cashOutConfirmTime',
            dataIndex: 'cashOutConfirmTime',
            align: 'center',
            width: '15%',
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
                title="查看订单"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="update" type="primary" className="pull-left"
                            onClick={this.handleOrderUpdateClick}>更新订单状态</Button>,
                    <Button key="back" onClick={this.handleOrderModifyCancel}>关闭</Button>,
                ]}
                onCancel={this.handleOrderModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveCashOrderModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashOrderTable);