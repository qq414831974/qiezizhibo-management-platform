import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Row, Col, Avatar} from 'antd';
import {getLeagueGiftOrder} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import defultAvatar from "../../../../static/avatar.jpg";
import logo from "../../../../static/logo.png";

const InputGroup = Input.Group;

class LeagueGiftOrderTable extends React.Component {
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
        this.fetch();
    };

    fetch = () => {
        this.setState({loading: true});
        getLeagueGiftOrder(this.props.leagueId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data ? data.data : [],
                });
            } else {
                message.error('获取礼物订单列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
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
            dataIndex: 'giftId',
            key: 'giftId',
            align: 'center',
            width: '20%',
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
                if (record.targetType == 0) {
                    return <div className="center"><Avatar
                        src={record.team && record.team.headImg ? record.team.headImg : logo}/>
                        <span className="ml-s">{record.team ? record.team.name : "未知"}</span></div>;
                } else if (record.targetType == 1) {
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueGiftOrderTable);