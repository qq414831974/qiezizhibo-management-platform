import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Row, Col, Avatar} from 'antd';
import {getOrders, updateOrder, closeOrder, queryOrder, refundOrder} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import OrderModifyDialog from './OrderModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import defultAvatar from "../../../static/avatar.jpg";
import NP from 'number-precision'

const InputGroup = Input.Group;

class OrderTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        filterPriceDropdownVisible: false,
        filterTypeDropdownVisible: false,
        filterUserDropdownVisible: false,
        searchText: '',
        filtered: false,
        filteredPrice: false,
        filteredType: false,
        filteredUser: false,
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
        getOrders(params).then((data) => {
            if (data && data.code == 200 && data.data.records) {
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
    onUserInputChange = (e) => {
        this.setState({filterUser: e.target.value});
    }
    onPriceBeginInputChange = (e) => {
        this.setState({searchPriceInputBegin: e.target.value});
    }
    onPriceEndInputChange = (e) => {
        this.setState({searchPriceInputEnd: e.target.value});
    }
    onSearch = () => {
        const {searchText, filterStatus, filterType, filterUser, searchPriceInputBegin, searchPriceInputEnd} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filterPriceDropdownVisible: false,
            filterTypeDropdownVisible: false,
            filterUserDropdownVisible: false,
            filtered: !!searchText || filterStatus != null,
            filteredPrice: !!searchPriceInputBegin && !!searchPriceInputEnd,
            filteredType: filterType != null,
            filteredUser: filterUser != null,
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
        this.showOrderModifyDialog();
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
        const {searchText, filterStatus, filterType, filterUser, searchPriceInputBegin, searchPriceInputEnd} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["id"] = searchText;
        }
        if (searchPriceInputBegin != null && searchPriceInputBegin != '' && searchPriceInputEnd != null && searchPriceInputEnd != '') {
            pager.filters["orderPrices"] = [searchPriceInputBegin * 100, searchPriceInputEnd * 100];
        }
        if (filterStatus != null) {
            pager.filters["orderStatus"] = filterStatus;
        }
        if (filterType != null) {
            pager.filters["type"] = filterType;
        }
        if (filterUser != null) {
            pager.filters["userNo"] = filterUser;
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
    saveOrderModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showOrderModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleOrderModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleOrderModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateOrder(values).then((data) => {
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
            filterStatus: e.target.value,
        });
    }
    onTypeDropDownRadioChange = (e) => {
        this.setState({
            filterType: e.target.value,
        });
    }
    handleOrderCancelClick = () => {
        this.setState({cancelVisible: true})
    }
    handleOrderRefundClick = () => {
        if (this.state.record.payType == 2) {
            message.warn('余额支付不允许退款', 3);
            return;
        }
        this.setState({refundVisible: true})
    }
    handleCancelOK = () => {
        closeOrder(this.state.record.id).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({cancelVisible: false, dialogModifyVisible: false})
                    this.refresh();
                    message.success('取消成功', 1);
                }
            } else {
                message.error('取消失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    handleRefundOK = () => {
        refundOrder(this.state.record.id).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({refundVisible: false, dialogModifyVisible: false})
                    this.refresh();
                    message.success('退款发起成功', 1);
                }
            } else {
                message.error('退款发起失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    dismissCancel = () => {
        this.setState({cancelVisible: false})
    }
    dismissRefund = () => {
        this.setState({refundVisible: false})
    }
    handleOrderUpdateClick = () => {
        queryOrder(this.state.record.id).then(data => {
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

        const ModifyDialog = Form.create()(OrderModifyDialog);

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
                            <Radio value={0}>未支付</Radio>
                            <Radio value={1}>已取消</Radio>
                            <Radio value={2}>已付款</Radio>
                            <Radio value={3}>退款中</Radio>
                            <Radio value={4}>已退款</Radio>
                            <Radio value={5}>退款失败</Radio>
                            <Radio value={6}>退款关闭</Radio>
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
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        }, {
            title: '价格（元）',
            dataIndex: 'orderPrice',
            key: 'orderPrice',
            align: 'center',
            width: '10%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <InputGroup size="large">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Input ref={ele => this.searchPriceInput = ele}
                                       placeholder="最低价"
                                       value={this.state.searchPriceInputBegin}
                                       onChange={this.onPriceBeginInputChange}/>
                            </Col>
                            <Col span={12}>
                                <Input placeholder="最高价"
                                       value={this.state.searchPriceInputEnd}
                                       onChange={this.onPriceEndInputChange}/>
                            </Col>
                        </Row>
                    </InputGroup>
                    <Button type="primary" icon="search" className="mt-s" onClick={this.onSearch}>查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filteredPrice ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterPriceDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterPriceDropdownVisible: visible,
                }, () => this.searchPriceInput && this.searchPriceInput.focus());
            },
            render: function (text, record, index) {
                return <span>{NP.divide(record.orderPrice, 100)}（元）</span>;
            },
        }, {
            title: '状态',
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            align: 'center',
            width: '6%',
            render: function (text, record, index) {
                let statusString = "未支付"
                switch (record.orderStatus) {
                    case 0:
                        statusString = "未支付"
                        break;
                    case 1:
                        statusString = "订单取消"
                        break;
                    case 2:
                        statusString = "已付款"
                        break;
                    case 3:
                        statusString = "退款中"
                        break;
                    case 4:
                        statusString = "已退款"
                        break;
                    case 5:
                        statusString = "退款失败"
                        break;
                    case 6:
                        statusString = "退款关闭"
                        break;
                }
                return <span>{statusString}</span>;
            },
        }, {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            align: 'center',
            width: '14%',
        }, {
            title: '支付方式',
            key: 'payType',
            dataIndex: 'payType',
            align: 'center',
            width: '7%',
            render: function (text, record, index) {
                let statusString = "微信支付"
                switch (record.payType) {
                    case 0:
                        statusString = "微信支付"
                        break;
                    case 1:
                        statusString = "余额支付"
                        break;
                }
                return <span>{statusString}</span>;
            },
        }, {
            title: '类型',
            key: 'type',
            dataIndex: 'type',
            align: 'center',
            width: '7%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onTypeDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={1}>购买比赛直播</Radio>
                            <Radio value={2}>购买比赛录播</Radio>
                            <Radio value={3}>比赛买断</Radio>
                            <Radio value={4}>礼物</Radio>
                            <Radio value={5}>竞猜</Radio>
                            <Radio value={6}>余额充值</Radio>
                            <Radio value={7}>联赛会员</Radio>
                        </Radio.Group>
                    </div>
                    <div className="w-full center mt-s">
                        <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    </div>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filteredType ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterTypeDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterTypeDropdownVisible: visible,
                });
            },
            render: function (text, record, index) {
                let typeString = "未支付"
                switch (record.type) {
                    case 1:
                        typeString = "购买比赛"
                        break;
                    case 2:
                        typeString = "购买比赛"
                        break;
                    case 3:
                        typeString = "比赛买断"
                        break;
                    case 4:
                        typeString = "礼物"
                        break;
                    case 5:
                        typeString = "竞猜"
                        break;
                    case 6:
                        typeString = "余额充值"
                        break;
                    case 7:
                        typeString = "联赛会员"
                        break;
                }
                return <span>{typeString}</span>;
            },
        }, {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
            align: 'center',
            width: '30%',
            render: function (text, record, index) {
                let dom = [];
                if (record.league) {
                    const league = record.league;
                    dom.push(<div>
                        <div className="center cursor-hand" onClick={toLeague.bind(this, record.league)}>
                            <Avatar src={league.headImg ? league.headImg : defultAvatar}/>
                            <p className="ml-s">{league.name}</p>
                        </div>
                        <div className="w-full center">
                            {record.type == 7 ? <span className="danger">联赛会员</span> : null}
                        </div>
                    </div>);
                }
                if (record.match) {
                    const match = record.match;
                    const hostTeam = match.hostTeam;
                    const guestTeam = match.guestTeam;
                    if (hostTeam == null || guestTeam == null) {
                        dom.push(<Tooltip title={`比赛时间：${match.startTime}`}>
                            <div className="cursor-hand"
                                 onClick={toMatch.bind(this, record.match)}>
                                {match.name}
                            </div>
                            <div className="w-full center">
                                {record.type == 3 ? <span className="danger">买断</span> : null}
                            </div>
                        </Tooltip>);
                    } else {
                        dom.push(<Tooltip title={`比赛时间：${match.startTime}`}>
                            <div className="center cursor-hand" onClick={toMatch.bind(this, record.match)}>
                                <Avatar src={hostTeam.headImg ? hostTeam.headImg : defultAvatar}/>
                                <p className="ml-s">{hostTeam.name}</p>
                                <p className="ml-s mr-s">VS</p>
                                <Avatar src={guestTeam.headImg ? guestTeam.headImg : defultAvatar}/>
                                <p className="ml-s">{guestTeam.name}</p>
                            </div>
                            <div className="w-full center">
                                {record.type == 3 ? <span className="danger">买断</span> : null}
                            </div>
                        </Tooltip>);
                    }
                }
                if (record.gift) {
                    const gift = record.gift;
                    dom.push(<div className="w-full center">
                        <Avatar src={gift.pic ? gift.pic : defultAvatar}/>
                        <p className="ml-s">{gift.name}</p>
                    </div>);
                }
                if (record.team) {
                    const team = record.team;
                    dom.push(<div className="w-full center">
                        <Avatar src={team.headImg ? team.headImg : defultAvatar}/>
                        <p className="ml-s">{team.name}</p>
                    </div>);
                }

                if (record.player) {
                    const player = record.player;
                    dom.push(<div className="w-full center">
                        <Avatar src={player.headImg ? player.headImg : defultAvatar}/>
                        <p className="ml-s">{player.name}</p>
                    </div>);
                }
                if (dom.length < 1) {
                    return <span>{record.description}</span>;
                }
                return <span>{dom}</span>;
            },
        }, {
            title: '用户',
            key: 'userNo',
            dataIndex: 'userNo',
            align: 'center',
            width: '6%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInputUser = ele}
                        placeholder="按用户id搜索"
                        value={this.state.filterUser}
                        onChange={this.onUserInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>按用户id查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filteredUser ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterUserDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterUserDropdownVisible: visible,
                }, () => this.searchInputUser && this.searchInputUser.focus());
            },
            render: function (text, record, index) {
                return <div/>
            }
        },
        ];
        const columns_moblie = [{
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
                            <Radio value={0}>未支付</Radio>
                            <Radio value={1}>已取消</Radio>
                            <Radio value={2}>已付款</Radio>
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
            width: '100%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        },
        ];
        return <div><Table columns={isMobile ? columns_moblie : columns}
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
                title="修改订单"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="update" type="primary" className="pull-left"
                            onClick={this.handleOrderUpdateClick}>更新订单状态</Button>,
                    <Button key="refund" type="danger" onClick={this.handleOrderRefundClick}>发起退款</Button>,
                    <Button key="cancel" type="danger" onClick={this.handleOrderCancelClick}>取消订单</Button>,
                    <Button key="back" onClick={this.handleOrderModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOrderModifyCancel}>确定</Button>,
                ]}
                onCancel={this.handleOrderModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveOrderModifyDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认取消"
                visible={this.state.cancelVisible}
                onOk={this.handleCancelOK}
                onCancel={this.dismissCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认取消该订单？</p>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认退款"
                visible={this.state.refundVisible}
                onOk={this.handleRefundOK}
                onCancel={this.dismissRefund}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认退款该订单？</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);