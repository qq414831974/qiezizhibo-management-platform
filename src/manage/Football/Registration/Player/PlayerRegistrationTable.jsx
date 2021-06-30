import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar} from 'antd';
import {
    getLeaguePlayerRegistration,
    deleteLeaguePlayerRegistration,
    updateLeaguePlayerRegistration,
    addLeaguePlayerRegistration,
    verifyLeaguePlayerRegistration
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import PlayerRegistrationAddDialog from './PlayerRegistrationAddDialog';
import PlayerRegistrationModifyDialog from './PlayerRegistrationModifyDialog';
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import NP from 'number-precision'
import {getQueryString} from "../../../../utils";

class PlayerRegistrationTable extends React.Component {
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
            leagueId: this.props.leagueId,
            registerTeamId: this.props.teamId
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getLeaguePlayerRegistration(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取球员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch({
            leagueId: this.props.leagueId,
            registerTeamId: this.props.teamId
        });
    }
    deleteLeaguePlayerRegistration = () => {
        deleteLeaguePlayerRegistration({id: this.state.record.id}).then((data) => {
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
        this.showPlayerRegistrationModifyDialog();
    }
    savePlayerRegistrationAddDialogRef = (form) => {
        this.formAdd = form;
    }
    savePlayerRegistrationModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showPlayerRegistrationAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showPlayerRegistrationModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLeaguePlayerRegistrationAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLeaguePlayerRegistrationModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleLeaguePlayerRegistrationAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = this.props.leagueId;
            values.registerTeamId = this.props.teamId;
            addLeaguePlayerRegistration(values).then((data) => {
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
    handleLeaguePlayerRegistrationModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = this.props.leagueId;
            values.registerTeamId = this.props.teamId;
            updateLeaguePlayerRegistration(values).then((data) => {
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
    handleLeaguePlayerRegistrationDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteLeaguePlayerRegistration,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const onNameClick = this.onNameClick;

        const AddDialog = Form.create()(PlayerRegistrationAddDialog);
        const ModifyDialog = Form.create()(PlayerRegistrationModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

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
            title: '球衣号',
            key: 'shirtNum',
            dataIndex: 'shirtNum',
            align: 'center',
            width: '10%',
        }, {
            title: '性别',
            key: 'gender',
            dataIndex: 'gender',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let gender = "其他";
                switch (record.gender) {
                    case 0:
                        gender = "女"
                        break;
                    case 1:
                        gender = "男"
                        break;
                    case 2:
                        gender = "其他"
                        break;
                }
                return <span>{gender}</span>;
            },
        }, {
            title: '手机号',
            key: 'phoneNumber',
            dataIndex: 'phoneNumber',
            align: 'center',
            width: '20%',
            render: function (text, record, index) {
                let contactType = "其他";
                switch (record.contactType) {
                    case 0:
                        contactType = "母亲"
                        break;
                    case 1:
                        contactType = "父亲"
                        break;
                    case 2:
                        contactType = "其他"
                        break;
                }
                return <span>{contactType}-{record.phoneNumber}</span>;
            },
        }, {
            title: '审核状态',
            dataIndex: 'verifyStatus',
            key: 'verifyStatus',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let type = "未审核";
                let color = ""
                switch (record.verifyStatus) {
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
                return <span className={color}>{type}</span>;
            },
        }, {
            title: '审核附加信息',
            key: 'verifyMessage',
            dataIndex: 'verifyMessage',
            align: 'center',
            width: '20%',
        },
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
                                               onClick={this.showPlayerRegistrationAddDialog}/>
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
                title="添加球员"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleLeaguePlayerRegistrationAddCancel}>取消</Button>,
                    <Button key="submit" type="primary"
                            onClick={this.handleLeaguePlayerRegistrationAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleLeaguePlayerRegistrationAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.savePlayerRegistrationAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改球员"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleLeaguePlayerRegistrationDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleLeaguePlayerRegistrationModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary"
                            onClick={this.handleLeaguePlayerRegistrationModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleLeaguePlayerRegistrationModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.savePlayerRegistrationModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerRegistrationTable);