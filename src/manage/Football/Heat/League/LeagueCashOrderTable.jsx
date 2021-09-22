import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, Row, Col} from 'antd';
import {
    getLeaguePlayerCashOrder,
    passLeaguePlayerCashOrder,
    failLeaguePlayerCashOrder,
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import CashOrderDetailDialog from './CashOrderDetailDialog';
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import defultAvatar from "../../../../static/avatar.jpg";
import NP from 'number-precision'

class LeagueCashOrderTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        record: {},
        searchType: 1
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params) => {
        this.getLeaguePlayerCashOrder(params);
    }
    getLeaguePlayerCashOrder = (params) => {
        this.setState({loading: true});
        getLeaguePlayerCashOrder(params).then((data) => {
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
                message.error('获取联赛提现订单列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
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
        const {searchText} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            if (this.state.searchType == 0) {
                pager.filters["playerName"] = searchText;
            } else if (this.state.searchType == 1) {
                pager.filters["cashOutOrderId"] = searchText;
            }
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
        this.setState({
            record: record,
            heatRule: this.props.heatRule,
            target: record.player,
            dialogModifyVisible: true
        });
    }
    handleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
        this.refresh();
    };

    getVerifyStatus = (record) => {
        let type = "未审核";
        let color = ""
        switch (record.cashOutVerifyStatus) {
            case -1:
                type = "不通过"
                color = "error"
                break;
            case 0:
                type = "未审核"
                color = "warn"
                break;
            case 1:
                type = "审核通过"
                color = "primary"
                break;
        }
        return <span className={color}>{type}</span>;
    }
    onNameDropDownRadioChange = (e) => {
        this.setState({
            searchType: e.target.value,
        });
    }

    render() {
        const onNameClick = this.onNameClick;

        const isMobile = this.props.responsive.data.isMobile;

        const getVerifyStatus = this.getVerifyStatus

        const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '10%',
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
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.searchType}>
                            <Radio value={1}>按订单号</Radio>
                            <Radio value={0}>按球员名字</Radio>
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
        }, {
            title: '球员',
            key: 'playerId',
            dataIndex: 'playerId',
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                if (record.player) {
                    const player = record.player;
                    return <div className="center">
                        <Avatar src={player && player.headImg ? player.headImg : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>
                            {player ? player.name : "未知"}
                        </a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '用户',
            key: 'userNo',
            dataIndex: 'userNo',
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                if (record.user) {
                    const user = record.user;
                    return <div className="center">
                        <Avatar src={user && user.avatar ? user.avatar : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>
                            {user ? user.name : "未知"}
                        </a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '金额（元）',
            key: 'cashOut',
            dataIndex: 'cashOut',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                if (record.cashOut) {
                    return <a className="ml-s" onClick={onNameClick.bind(this, record)}>
                        {NP.divide(record.cashOut, 100)}
                    </a>;
                }
                return "-";
            },
        }, {
            title: '状态',
            key: 'cashOutVerifyStatus',
            dataIndex: 'cashOutVerifyStatus',
            width: '10%',
            align: 'center',
            filterMultiple: false,
            filters: [
                {text: '不通过', value: -1},
                {text: '未审核', value: 0},
                {text: '审核通过', value: 1},
            ],
            render: function (text, record, index) {
                return getVerifyStatus(record)
            },
        }, {
            title: '审核时间',
            key: 'cashOutVerifyDate',
            dataIndex: 'cashOutVerifyDate',
            width: '15%',
            align: 'center',
        }, {
            title: '提现订单号',
            key: 'cashOutOrderId',
            dataIndex: 'cashOutOrderId',
            width: '15%',
            align: 'center',
        }
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
                title="提现审核"
                visible={this.state.dialogModifyVisible}
                destroyOnClose
                footer={[
                    <Button key="back" onClick={this.handleModifyCancel}>关闭</Button>,
                ]}
                onCancel={this.handleModifyCancel}>
                <CashOrderDetailDialog
                    id={this.state.record.id}
                    visible={this.state.dialogModifyVisible}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueCashOrderTable);