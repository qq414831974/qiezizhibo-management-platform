import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, List, Card} from 'antd';
import {
    getLeagueTeamRegistration,
    deleteLeagueTeamRegistration,
    updateLeagueTeamRegistration,
    addLeagueTeamRegistration,
    verifyLeagueTeamRegistration,
    getLeaguePlayerRegistration,
    importLeagueTeamRegistration
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import TeamRegistrationAddDialog from './TeamRegistrationAddDialog';
import TeamRegistrationModifyDialog from './TeamRegistrationModifyDialog';
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import NP from 'number-precision'
import {getQueryString} from "../../../../utils";
import defultAvatar from "../../../../static/avatar.jpg";

class TeamRegistrationTable extends React.Component {
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
            leagueId: this.props.leagueId
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getLeagueTeamRegistration(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch({
            leagueId: this.props.leagueId
        });
    }
    getLeaguePlayerRegistration = (teamId) => {
        this.setState({playerLoading: true});
        getLeaguePlayerRegistration({leagueId: this.props.leagueId, registerTeamId: teamId}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    playerLoading: false,
                    playerData: data.data,
                });
            } else {
                message.error('获取球员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    deleteLeagueTeamRegistration = () => {
        deleteLeagueTeamRegistration({id: this.state.record.id}).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
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
    };
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.getLeaguePlayerRegistration(record.id);
        this.showTeamRegistrationModifyDialog();
    }
    saveTeamRegistrationAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveTeamRegistrationModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showTeamRegistrationAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showTeamRegistrationModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLeagueTeamRegistrationAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLeagueTeamRegistrationModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleLeagueTeamRegistrationAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = this.props.leagueId;
            addLeagueTeamRegistration(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleLeagueTeamRegistrationModifyCreateConfrim = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = this.props.leagueId;
            let record = this.state.record
            for (let key of Object.keys(values)) {
                if (values[key] != null) {
                    record[key] = values[key]
                }
            }
            let isPlayerVerify = true;
            if (this.state.playerData) {
                for (let player of this.state.playerData) {
                    if (player.verifyStatus != 1) {
                        isPlayerVerify = false;
                    }
                }
            }
            if (isPlayerVerify || values.verifyStatus != 1) {
                this.setState({formModify: values, record: record}, () => {
                    this.handleLeagueTeamRegistrationModifyCreate();
                })
            } else {
                this.setState({teamVerifyConfirmShow: true, formModify: values, record: record})
            }
        });
    }
    handleLeagueTeamRegistrationModifyCreateCancel = () => {
        this.setState({teamVerifyConfirmShow: false})
    }
    handleLeagueTeamRegistrationModifyCreate = () => {
        const values = this.state.formModify;
        // form.validateFields((err, values) => {
        //     if (err) {
        //         return;
        //     }
        //     values.leagueId = this.props.leagueId;
        updateLeagueTeamRegistration(values).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
        // form.resetFields();
        this.setState({dialogModifyVisible: false, teamVerifyConfirmShow: false});
        // });
    };
    handleLeagueTeamRegistrationDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteLeagueTeamRegistration,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    onPlayerClick = (id) => {
        const history = this.props.history;
        history.push(`/football/league/registration/player?leagueId=${this.props.leagueId}&teamId=${id}`);
    }
    showPlayerModal = (record) => {
        this.getLeaguePlayerRegistration(record.id);
        this.setState({playerShow: true, record: record})
    }
    getVerifyStatus = (record, className) => {
        let type = "未审核";
        let color = ""
        switch (record.verifyStatus) {
            case -2:
                type = "未提交"
                color = "info"
                break;
            case -1:
                type = "未审核"
                color = "warn"
                break;
            case 0:
                type = "审核未通过"
                color = "danger"
                break;
            case 1:
                type = "审核通过"
                color = "primary"
                break;
        }
        return <span className={`${color} ${className ? className : ""}`}>{type}</span>;
    }
    showImportConfirm = (record) => {
        if (record.verifyStatus != 1) {
            message.success('请先审核通过！', 1);
            return;
        }
        if (record) {
            this.setState({importConfirmShow: true, currentImportRecords: [record]})
        } else {
            let verifyList = [];
            for (let team of this.state.data) {
                if (record.verifyStatus == 1) {
                    verifyList.push(team)
                }
            }
            this.setState({importConfirmShow: true, currentImportRecords: verifyList})
        }
    }
    handleImportCancel = () => {
        this.setState({importConfirmShow: false})
    }
    handleImportAll = () => {
        const dataList = this.state.currentImportRecords;
        let requestList = [];
        if (dataList) {
            for (let data of dataList) {
                const func = importLeagueTeamRegistration({id: data.id}).then(res => {
                    if (res && res.code == 200) {
                        if (res.data) {
                            this.refresh();
                            message.success(data.name + '导入成功', 1);
                        }
                    } else {
                        message.error(data.name + ' 导入失败：' + (res ? res.code + ":" + res.message : res), 3);
                    }
                })
                requestList.push(func)
            }
            this.setState({importLoading: true})
            Promise.all(requestList).then(() => {
                this.setState({importLoading: false, importConfirmShow: false})
            });
        }
    }

    render() {
        const onNameClick = this.onNameClick;

        const AddDialog = Form.create()(TeamRegistrationAddDialog);
        const ModifyDialog = Form.create()(TeamRegistrationModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;
        const showPlayerModal = this.showPlayerModal
        const getVerifyStatus = this.getVerifyStatus
        const showImportConfirm = this.showImportConfirm

        const columns = [{
            title: '名字',
            key: 'name',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                if (record.headImg) {
                    return <div className="center cursor-hand"><Avatar src={record.headImg ? record.headImg : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
                }
                return <span className="cursor-hand" onClick={onNameClick.bind(this, record)}>{record.name}</span>;
            },
        }, {
            title: '手机号',
            key: 'phoneNumber',
            dataIndex: 'phoneNumber',
            align: 'center',
            width: '10%',
        }, {
            title: '审核状态',
            dataIndex: 'verifyStatus',
            key: 'verifyStatus',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                return getVerifyStatus(record)
            },
        }, {
            title: '审核附加信息',
            key: 'verifyMessage',
            dataIndex: 'verifyMessage',
            align: 'center',
            width: '20%',
        }, {
            title: '登记时间',
            key: 'registerTime',
            dataIndex: 'registerTime',
            align: 'center',
            width: '10%',
        }, {
            title: '查看球员',
            key: 'view',
            dataIndex: 'view',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                return <span className="cursor-hand" onClick={showPlayerModal.bind(this, record)}>查看</span>;
            },
        }, {
            title: '关联球队',
            key: 'teamId',
            dataIndex: 'teamId',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let type = "未生成";
                let color = ""
                if (record.teamId == null) {
                    type = "点击生成"
                    color = "warn"
                } else {
                    type = "已生成"
                    color = "primary"
                }
                return <span className={`${color} cursor-hand`}
                             onClick={showImportConfirm.bind(this, record)}>{type}</span>;
            },
        }
        ];
        const columns_moblie = [{
            title: '名字',
            key: 'name',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                if (record.pic) {
                    return <div className="center"><Avatar src={record.pic ? record.pic : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
                }
                return <span>{record.name}</span>;
            },
        },
        ];
        return <div><Table columns={isMobile ? columns_moblie : columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           loading={this.state.loading}
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus"
                                               onClick={this.showTeamRegistrationAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="一键导入审核通过的球队">
                                       <Button type="primary" icon="import"
                                               onClick={showImportConfirm.bind(this, null)}>
                                           一键导入审核通过的球队
                                       </Button>
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
                title="添加队伍"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleLeagueTeamRegistrationAddCancel}>取消</Button>,
                    <Button key="submit" type="primary"
                            onClick={this.handleLeagueTeamRegistrationAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleLeagueTeamRegistrationAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveTeamRegistrationAddDialogRef}/>
            </Modal>
            <Modal
                title="修改队伍"
                destroyOnClose
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleLeagueTeamRegistrationDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleLeagueTeamRegistrationModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary"
                            onClick={this.handleLeagueTeamRegistrationModifyCreateConfrim}>确定</Button>,
                ]}
                onCancel={this.handleLeagueTeamRegistrationModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveTeamRegistrationModifyDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.state.handleDeleteOK}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认删除{this.state.deleteCols}条数据？</p>
            </Modal>
            <Modal
                title="确认审核"
                visible={this.state.teamVerifyConfirmShow}
                onOk={this.handleLeagueTeamRegistrationModifyCreate}
                onCancel={this.handleLeagueTeamRegistrationModifyCreateCancel}
                zIndex={1001}
            >
                <p className="mb-n danger" style={{fontSize: 14}}>报名球队中球员未全部审核通过，是否确认审核通过？</p>
            </Modal>
            <Modal
                title="确认导入"
                visible={this.state.importConfirmShow}
                onOk={this.handleImportAll}
                onCancel={this.handleImportCancel}
                zIndex={1001}
                confirmLoading={this.state.importLoading}
            >
                <p className="mb-n danger" style={{fontSize: 14}}>导入后将覆盖原球队信息，是否确认？</p>
            </Modal>
            <Modal
                title="球员报名情况"
                visible={this.state.playerShow}
                footer={null}
                onCancel={() => {
                    this.setState({playerShow: false})
                }}
                zIndex={1001}
            >
                <div>
                    <Card bordered={false}
                          title={
                              <div>
                                  <div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                      <Avatar
                                          src={this.state.record.headImg ? this.state.record.headImg : defultAvatar}/>
                                      <span className="ml-s">{this.state.record.name}</span>
                                  </div>
                                  <div className="w-full center mt-s">
                                      <Button key="more" type="primary"
                                              onClick={this.onPlayerClick.bind(this, this.state.record.id)}>查看详细</Button>
                                  </div>
                              </div>}>
                        <List itemLayout="horizontal"
                              size="small"
                              dataSource={this.state.playerData}
                              renderItem={item => (
                                  <List.Item className="cell-hover">
                                      <List.Item.Meta
                                          avatar={<Avatar
                                              src={item.headImg}/>}
                                          title={<div>
                                              <span>{item.name}</span>{this.getVerifyStatus(item, "pull-right")}</div>}
                                          description={`${item.shirtNum}号`}
                                      />
                                  </List.Item>
                              )}>
                        </List>
                    </Card>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamRegistrationTable);