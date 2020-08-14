import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Row, Col, Avatar} from 'antd';
import {getOrders, updateOrder, closeOrder, queryOrder, refundOrder} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import OrderModifyDialog from './OrderModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import defultAvatar from "../../../static/avatar.jpg";

const InputGroup = Input.Group;

class OrderTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        filteredPrice: false,
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
    onPriceBeginInputChange = (e) => {
        this.setState({searchPriceInputBegin: e.target.value});
    }
    onPriceEndInputChange = (e) => {
        this.setState({searchPriceInputEnd: e.target.value});
    }
    onSearch = () => {
        const {searchText, filterType, searchPriceInputBegin, searchPriceInputEnd} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText || filterType != null,
            filteredPrice: !!searchPriceInputBegin && !!searchPriceInputEnd,
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
        const {searchText, filterType, searchPriceInputBegin, searchPriceInputEnd} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["id"] = searchText;
        }
        if (searchPriceInputBegin != null && searchPriceInputBegin != '' && searchPriceInputEnd != null && searchPriceInputEnd != '') {
            pager.filters["orderPrices"] = [searchPriceInputBegin, searchPriceInputEnd];
        }
        if (filterType != null) {
            pager.filters["orderStatus"] = filterType;
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
            filterType: e.target.value,
        });
    }
    handleOrderCancelClick = () => {
        this.setState({cancelVisible: true})
    }
    handleOrderRefundClick = () => {
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

    render() {
        const onNameClick = this.onNameClick;
        const toMatch = this.toMatch;

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
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
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
            width: '25%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        }, {
            title: '价格（分）',
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
        }, {
            title: '状态',
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            align: 'center',
            width: '10%',
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
            width: '20%',
        }, {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
            align: 'center',
            width: '35%',
            render: function (text, record, index) {
                if (record.match) {
                    const match = record.match;
                    const hostteam = match.hostteam;
                    const guestteam = match.guestteam;
                    if (hostteam == null || guestteam == null) {
                        return <Tooltip title={`比赛时间：${match.startTime}`}><span className="cursor-hand"
                                                                                onClick={toMatch.bind(this, record.match)}>{match.name}</span></Tooltip>;
                    }
                    return <Tooltip title={`比赛时间：${match.startTime}`}>
                        <div className="center cursor-hand" onClick={toMatch.bind(this, record.match)}>
                            <Avatar src={hostteam.headImg ? hostteam.headImg : defultAvatar}/>
                            <p className="ml-s">{hostteam.name}</p>
                            <p className="ml-s mr-s">VS</p>
                            <Avatar src={guestteam.headImg ? guestteam.headImg : defultAvatar}/>
                            <p className="ml-s">{guestteam.name}</p>
                            {record.type == 3 ? <span className="danger">买断</span>:null}
                        </div>
                    </Tooltip>;
                }
                return <span>{record.description}</span>;
            },
        }
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
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
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
                    <Button key="submit" type="primary" onClick={this.handleOrderModifyCreate}>确定</Button>,
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