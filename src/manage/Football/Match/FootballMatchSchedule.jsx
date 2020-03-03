import React from 'react';
import {Row, Col, Card, Modal, Table, Avatar} from 'antd';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getAllMatchSchedule, delMatchSchedule} from "../../../axios";
import {message} from "antd/lib/index";
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import defultAvatar from '../../../static/avatar.jpg';
import {parseTimeString} from "../../../utils";


class FootBallMatchSchedule extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    }

    fetch = (param) => {
        this.setState({loading: true});
        getAllMatchSchedule(param).then((data) => {
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
                message.error('获取列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        const pager = {...this.state.pagination};
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            status: pager.filters.status && pager.filters.status.length > 0 ? pager.filters.status[0] : null,
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.filters = filters;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            status: pager.filters.status && pager.filters.status.length > 0 ? pager.filters.status[0] : null,
        });
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showDeleteDialog();
    };
    showDeleteDialog = () => {
        this.setState({deleteVisible: true});
    }
    hideDeleteDialog = () => {
        this.setState({deleteVisible: false});
    }
    handleDeleteOK = () => {
        delMatchSchedule({id: this.state.record.id}).then(data => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    render() {
        const onNameClick = this.onNameClick;
        const columns = [{
            title: '比赛',
            align: 'center',
            dataIndex: 'matchId',
            key: 'status',
            width: '50%',
            filters: [
                {text: '未执行', value: -1},
                {text: '已执行', value: 1},
                {text: '失败', value: 0},
            ],
            filterMultiple: false,
            render: function (text, item, index) {
                const record = item.match;
                const hostteam = record.hostteam;
                const guestteam = record.guestteam;
                if (hostteam == null || guestteam == null) {
                    return <span>{record.name}</span>
                }
                return <div className="center cursor-hand" onClick={onNameClick.bind(this, item)}>
                    <Avatar src={hostteam.headImg ? hostteam.headImg : defultAvatar}/>
                    <p className="ml-s">{hostteam.name}</p>
                    <p className="ml-s mr-s">VS</p>
                    <Avatar src={guestteam.headImg ? guestteam.headImg : defultAvatar}/>
                    <p className="ml-s">{guestteam.name}</p>
                </div>;
            },
        }, {
            title: '时间',
            align: 'center',
            dataIndex: 'datebegin',
            width: '20%',
            render: function (text, item, index) {
                const record = item.match;
                return <span>{(record.startTime ? parseTimeString(record.startTime) : "-")}</span>
            }
        }, {
            title: '比分',
            align: 'center',
            width: '10%',
            render: function (text, item, index) {
                const record = item.match;
                return <span>{record.score ? (record.score + (record.penaltyscore ? `(${record.penaltyscore})` : "")) : "-"}</span>;
            },
        }, {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            width: '20%',
            render: function (text, record, index) {
                return <span>{record.status == -1 ? "未执行" : (record.status == 1 ? "完成" : "错误")}</span>
            }
        }
        ];
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="计划"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <Table columns={columns}
                                       rowKey={record => record.id}
                                       dataSource={this.state.data}
                                       pagination={this.state.pagination}
                                       loading={this.state.loading}
                                       onChange={this.handleTableChange}
                                       bordered
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDeleteOK}
                    onCancel={this.hideDeleteDialog}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除此计划？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    console.log(state)

    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchSchedule);