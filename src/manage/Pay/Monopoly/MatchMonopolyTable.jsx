import React from 'react';
import {Table, Button, Tooltip, Avatar} from 'antd';
import {getMatchMonopolys} from '../../../axios/index';
import {message} from "antd/lib/index";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../static/logo.png";
import defultAvatar from "../../../static/avatar.jpg";


class MatchMonopolyTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
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
        getMatchMonopolys(params).then((data) => {
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
                message.error('获取比赛买断列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
        });
    }

    render() {
        const columns = [{
            title: 'id',
            key: 'id',
            width: '5%',
            align: 'center',
            render: function (text, record, index) {
                return <span>{record.id}</span>;
            },
        }, {
            title: '用户id',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '30%',
            render: function (text, record, index) {
                if (record.user) {
                    return <div className="center"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                        <span className="ml-s">{record.user.name}</span></div>;
                }
                return <span>{record.userNo}</span>;
            },
        },
            {
                title: '详细',
                key: 'externalId',
                dataIndex: 'externalId',
                align: 'center',
                width: '35%',
                render: function (text, record, index) {
                    const match = record.match;
                    const hostTeam = match.hostTeam;
                    const guestTeam = match.guestTeam;
                    if (hostTeam == null || guestTeam == null) {
                        return <Tooltip title={`比赛时间：${match.startTime}`}><span>{match.name}</span></Tooltip>
                    }
                    return <Tooltip title={`比赛时间：${match.startTime}`}>
                        <div className="center">
                            <Avatar src={hostTeam.headImg ? hostTeam.headImg : defultAvatar}/>
                            <p className="ml-s">{hostTeam.name}</p>
                            <p className="ml-s mr-s">VS</p>
                            <Avatar src={guestTeam.headImg ? guestTeam.headImg : defultAvatar}/>
                            <p className="ml-s">{guestTeam.name}</p>
                        </div>
                    </Tooltip>;
                },
            },
            {
                title: '订单号',
                key: 'orderId',
                dataIndex: 'orderId',
                align: 'center',
                width: '25%',
            },
            {
                title: '类型',
                key: 'anonymous',
                dataIndex: 'anonymous',
                align: 'center',
                width: '5%',
                render: function (text, record, index) {
                    return <span>{record.anonymous ? "匿名" : "实名"}</span>;
                },
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchMonopolyTable);