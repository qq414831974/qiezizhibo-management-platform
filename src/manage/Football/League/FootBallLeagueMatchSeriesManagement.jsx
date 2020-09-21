import React from 'react';
import {Row, Col, Card, Button, Table, Avatar, Modal} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {
    getLeagueInfoBySeriesId,
    addLeagueIntoSeries,
    removeLeagueIntoSeries,
    getNoSeriesLeague,
    createLeagueMatch, updateLeagueMatchById,
    getLeagueMatchById, delLeagueMatchByIds, setLeagueEncryptionAll,
} from "../../../axios";
import {parseTimeStringYMD} from "../../../utils";
import copy from "copy-to-clipboard/index";
import {Form, message} from "antd/lib/index";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import defultAvatar from '../../../static/avatar.jpg';
import FootBallLeagueMatchModifyDialog from "./FootBallLeagueSeriesModifyDialog";
import FootBallLeagueMatchAddDialog from "./FootBallLeagueSeriesAddDialog";
import {Link} from 'react-router-dom';
import FootBallLeagueSeriesAddLeagueDialog from "./FootBallLeagueSeriesAddLeagueDialog";

class FootBallLeagueMatchSeriesManagement extends React.Component {
    state = {
        data: [],
        record: {},
        leagueData: {},
    }

    componentDidMount() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return;
        }
        this.fetch();
    }

    fetch = () => {
        this.setState({loading: true})
        getLeagueInfoBySeriesId({pageSize: 100, pageNum: 1, seriesId: this.props.match.params.id}).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data.records,
                });
            }
        })
        getLeagueMatchById(this.props.match.params.id).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    leagueData: data.data,
                });
            }
        })
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showLeagueMatchModifyDialog();
    };
    saveLeagueMatchDialogRef = (form) => {
        this.formAdd = form;
    };
    saveLeagueMatchModifyDialogRef = (form) => {
        this.formModify = form;
    };
    saveAddLeagueDialogRef = (form) => {
        this.formAddLeague = form;
    }
    showLeagueMatchAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showLeagueMatchModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLeagueMatchAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLeagueMatchModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleLeagueMatchAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["dateBegin"] = values["dateBegin"] ? values["dateBegin"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["dateEnd"] = values["dateEnd"] ? values["dateEnd"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createTime"] = values["createTime"] ? values["createTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updateTime"] = values["updateTime"] ? values["updateTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deleteTime"] = values["deleteTime"] ? values["deleteTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            createLeagueMatch(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.fetch();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleLeagueMatchModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["dateBegin"] = values["dateBegin"] ? values["dateBegin"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["dateEnd"] = values["dateEnd"] ? values["dateEnd"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createTime"] = values["createTime"] ? values["createTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updateTime"] = values["updateTime"] ? values["updateTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deleteTime"] = values["deleteTime"] ? values["deleteTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            updateLeagueMatchById(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.fetch();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleAddLeagueOK = () => {
        const form = this.formAddLeague;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addLeagueIntoSeries(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.fetch();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddSeriesVisible: false});
        });
    }
    deleteRecord = () => {
        delLeagueMatchByIds({id: [this.state.record.id]}).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.fetch();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    removeRecord = () => {
        removeLeagueIntoSeries({leagueId: this.state.record.id, parentId: this.state.record.parentid}).then(data => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.fetch();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleLeagueDelete = () => {
        this.setState({deleteVisible: true, deleteType: "league"});
    }
    handleLeagueSeriesDelete = () => {
        this.setState({deleteVisible: true, deleteType: "series"});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    showLeagueSeriesAddDialog = () => {
        this.setState({dialogAddSeriesVisible: true});
    }
    hideLeagueSeriesAddDialog = () => {
        this.setState({dialogAddSeriesVisible: false});
    }
    handleDeleteOK = () => {
        if (this.state.deleteType === "league") {
            this.deleteRecord();
        } else if (this.state.deleteType === "series") {
            this.removeRecord();
        }
    }
    handleLeagueEncryptionAllConfirm = () => {
        this.setState({encrypitonAllConfirm: true})
    }
    cancelLeagueEncryptionAllConfirm = () => {
        this.setState({encrypitonAllConfirm: false})
    }
    handleLeagueEncryptionAll = () => {
        setLeagueEncryptionAll(this.state.record.id).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('比赛全部设置加密成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('比赛全部设置加密失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    render() {
        const isMobile = this.props.responsive.data.isMobile;
        const onNameClick = this.onNameClick;
        const AddDialog = Form.create()(FootBallLeagueMatchAddDialog);
        const ModifyDialog = Form.create()(FootBallLeagueMatchModifyDialog);
        const AddLeagueDialog = Form.create()(FootBallLeagueSeriesAddLeagueDialog);

        const columns = [{
            title: '名字',
            align: 'center',
            dataIndex: 'name',
            width: '30%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headImg ? record.headImg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishName ? "(" + record.englishName + ")" : ""}</p>
                </div>;
            },
        }, {
            title: '地点',
            align: 'center',
            dataIndex: 'country',
            width: '10%',
            render: function (text, record, index) {
                return <p>{record.country ? record.country : "-"}/{record.city ? record.city : "-"}</p>
            }
        }, {
            title: '时间',
            align: 'center',
            dataIndex: 'dateBegin',
            width: '20%',
            render: function (text, record, index) {
                return <p>{(record.dateBegin ? parseTimeStringYMD(record.dateBegin) : "-") + "~" + (record.dateEnd ? parseTimeStringYMD(record.dateEnd) : "-")}</p>
            }
        }, {
            title: '类型',
            align: 'center',
            dataIndex: 'isparent',
            width: '10%',
            render: function (text, record, index) {
                return <p>{(record.isparent ? "系列赛" : "联赛")}</p>
            }
        }, {
            title: '联系电话',
            align: 'center',
            dataIndex: 'phoneNumber',
            width: '15%',
            render: function (text, record, index) {
                return <p>{record.phoneNumber ? record.phoneNumber : "-"}</p>
            }
        },
            {
                title: "备注",
                align: 'center',
                dataIndex: 'remark',
                width: '10%',
            },
            {
                title: <span>轮播id</span>,
                align: 'center',
                width: '5%',
                render: function (text, record, index) {
                    return <p className="cursor-hand" onClick={() => {
                        copy(`../leagueManager/leagueManager?id=${record.id}`);
                        message.success('轮播链接已复制到剪贴板');
                    }}>{record.id ? `${record.id}` : "-"}</p>
                }
            },
        ];
        const columns_mobile = [{
            title: '名字',
            align: 'center',
            dataIndex: 'name',
            width: '100%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headImg ? record.headImg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishName ? "(" + record.englishName + ")" : ""}</p>
                </div>;
            },
        }
        ];
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="系列赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="w-full center">
                                    <div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                        <span>系列赛：</span>
                                        <Avatar
                                            src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                        <span
                                            className="ml-s">{this.state.leagueData.name}{this.state.leagueData.englishName ? "(" + this.state.leagueData.englishName + ")" : ""}</span>
                                    </div>
                                </div>
                                <Table columns={isMobile ? columns_mobile : columns}
                                       rowKey={record => record.id}
                                       dataSource={this.state.data}
                                       loading={this.state.loading}
                                       bordered
                                       size="small"
                                       className="mt-m"
                                       title={() =>
                                           <div>
                                               <Button type="primary" shape="circle" icon="plus"
                                                       onClick={this.showLeagueMatchAddDialog}/>
                                               <Button type="primary" shape="circle" icon="zoom-in"
                                                       onClick={this.showLeagueSeriesAddDialog}/>
                                               <Button type="primary" shape="circle" icon="reload"
                                                       className="pull-right"
                                                       loading={this.state.loading}
                                                       onClick={this.fetch}/>
                                           </div>
                                       }
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal
                    key="dialog-add"
                    className={isMobile ? "top-n" : ""}
                    width={700}
                    visible={this.state.dialogAddVisible}
                    title="添加联赛"
                    okText="确定"
                    onCancel={this.handleLeagueMatchAddCancel}
                    destroyOnClose="true"
                    onOk={this.handleLeagueMatchAddCreate}
                >
                    <AddDialog
                        leagueData={this.state.leagueData}
                        visible={this.state.dialogAddVisible}
                        ref={this.saveLeagueMatchDialogRef}/>
                </Modal>
                <Modal
                    key="dialog-modify"
                    className={isMobile ? "top-n" : ""}
                    width={700}
                    visible={this.state.dialogModifyVisible}
                    title="编辑联赛"
                    okText="确定"
                    onCancel={this.handleLeagueMatchModifyCancel}
                    destroyOnClose="true"
                    onOk={this.handleLeagueMatchModifyCreate}
                    footer={[
                        <Button key="detail" type="primary" className="pull-left">
                            <Link to={
                                `/football/footballLeagueMatch/${this.state.record.id}`
                            }>详细设置</Link>
                        </Button>,
                        <Button key="view" type="primary" className="pull-left">
                            <Link to={
                                `/football/footballMatch?leagueId=${this.state.record.id}`
                            }>浏览比赛</Link>
                        </Button>,
                        <Button key="encryption" type="primary" className="pull-left"
                                onClick={this.handleLeagueEncryptionAllConfirm}>设置加密</Button>,
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handleLeagueDelete}>删除</Button>,
                        <Button key="delete2" type="danger" className="pull-left"
                                onClick={this.handleLeagueSeriesDelete}>从系列赛移除</Button>,
                        <Button key="back" onClick={this.handleLeagueMatchModifyCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleLeagueMatchModifyCreate}>
                            确定
                        </Button>
                    ]}
                >
                    <ModifyDialog
                        visible={this.state.dialogModifyVisible}
                        ref={this.saveLeagueMatchModifyDialogRef}
                        leagueData={this.state.leagueData}
                        record={this.state.record}/>
                </Modal>
                <Modal
                    key="dialog-delete"
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p style={{fontSize: 14}}>{this.state.deleteType === "league" ? "是否确认删除条数据？" : "是否移除？"}</p>
                    {this.state.deleteType === "league" ?
                        <p className="mb-n text-danger">注意：删除联赛将删除联赛所有比赛数据！！！</p> : null}
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="添加联赛"
                    okText="确定"
                    visible={this.state.dialogAddSeriesVisible}
                    onOk={this.handleAddLeagueOK}
                    onCancel={this.hideLeagueSeriesAddDialog}
                    zIndex={1001}
                    destroyOnClose="true"
                >
                    <AddLeagueDialog
                        visible={this.state.dialogAddSeriesVisible}
                        record={this.state.leagueData}
                        ref={this.saveAddLeagueDialogRef}/>
                </Modal>
                <Modal
                    key="dialog-encryptionAll"
                    className={isMobile ? "top-n" : ""}
                    title="确认设置加密"
                    visible={this.state.encrypitonAllConfirm}
                    onOk={this.handleLeagueEncryptionAll}
                    onCancel={this.cancelLeagueEncryptionAllConfirm}
                    zIndex={1001}
                >
                    <p style={{fontSize: 14}}>将设置联赛下的所有比赛为加密，是否确认？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchSeriesManagement);