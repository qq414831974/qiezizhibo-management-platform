import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Row, Col, Avatar} from 'antd';
import {getGiftOrder} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import defultAvatar from "../../../../static/avatar.jpg";
import logo from "../../../../static/logo.png";

const InputGroup = Input.Group;

class MatchGiftOrderTable extends React.Component {
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

    fetch = (params) => {
        this.setState({loading: true});
        getGiftOrder({matchId: this.props.matchId, ...params}).then((data) => {
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
                message.error('获取礼物订单列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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


    render() {
        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            align: 'center',
            width: '10%',
        }, {
            title: '订单号',
            key: 'orderId',
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                if (record.orderId == null && record.type == 1) {
                    return <div>后台刷票</div>
                } else if (record.orderId == null) {
                    return <div>免费票</div>
                }
                return <div>{record.orderId}</div>;
            },
        }, {
            title: '用户',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '20%',
            render: function (text, record, index) {
                if (record.user) {
                    return <div className="center"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                        <span className="ml-s">{record.user.name}</span></div>;
                }
                return <span>{record.userNo}</span>;
            },
        }, {
            title: '礼物',
            key: 'type',
            align: 'center',
            width: '20%',
            filterMultiple: false,
            filters: [
                {text: '免费', value: 0},
                {text: '收费', value: 1},
            ],
            render: function (text, record, index) {
                if (record.gift) {
                    return <div className="center"><Avatar src={record.gift.pic ? record.gift.pic : logo}/>
                        <span className="ml-s">{record.gift.name} * {record.num}</span></div>;
                }
                return <span>{record.giftId} * {record.num}</span>;
            },
        }, {
            title: '对象',
            dataIndex: 'externalId',
            key: 'externalId',
            align: 'center',
            width: '20%',
            render: function (text, record, index) {
                if (record.targetType == 0 || record.targetType == 3) {
                    return <div className="center"><Avatar
                        src={record.team && record.team.headImg ? record.team.headImg : logo}/>
                        <span className="ml-s">{record.team ? record.team.name : "未知"}</span></div>;
                } else if (record.targetType == 1 || record.targetType == 2) {
                    return <div className="center"><Avatar
                        src={record.player && record.player.headImg ? record.player.headImg : logo}/>
                        <span className="ml-s">
                            {record.player ? record.player.name : "未知"}({record.player ? record.player.shirtNum : "0"}号)
                        </span>
                    </div>;
                }
                return <span>{record.externalId}</span>;
            },
        }, {
            title: '送出时间',
            key: 'finishTime',
            dataIndex: 'finishTime',
            align: 'center',
            width: '15%',
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
                               <div style={{minHeight: 32}}>
                                   <Tooltip title="刷新">
                                       <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchGiftOrderTable);