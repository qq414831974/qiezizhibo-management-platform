import React from 'react';
import {Row, Col, Card, Descriptions, Spin, Tooltip, Button, message, Modal, Form} from 'antd';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {
    getUserAddress,
    createUserAddress,
    updateUserAddress,
    delUserAddress,
} from "../../../axios/index";
import UserAddressAddDialog from "./UserAddressAddDialog"
import UserAddressModifyDialog from "./UserAddressModifyDialog"
import {Link} from "react-router-dom";

class UserAddressPanel extends React.Component {
    state = {
        loading: false,
        data: null,
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        if (this.props.userNo == null) {
            return;
        }
        this.setState({loading: true})
        getUserAddress({userNo: this.props.userNo}).then(data => {
            this.setState({data: data.data, loading: false})
        })
    }
    refresh = () => {
        this.fetch();
    }
    saveAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleAddCreate = () => {
        if (this.state.isAdding) {
            return;
        }
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({isAdding: true})
            values.userNo = this.props.userNo
            createUserAddress(values).then((data) => {
                this.setState({isAdding: false})
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
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
    handleModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.userNo = this.props.userNo
            updateUserAddress(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
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
    deleteRecord = () => {
        delUserAddress({userNo: this.props.userNo}).then((data) => {
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
    }
    handleDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteRecord,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const AddDialog = Form.create()(UserAddressAddDialog);
        const ModifyDialog = Form.create()(UserAddressModifyDialog);
        return (
            <div>
                <div className="mb-m" style={{minHeight: 32}}>
                    {this.state.data == null ?
                        <Tooltip title="新增">
                            <Button type="primary" shape="circle" icon="plus"
                                    className="pull-left"
                                    disabled={this.state.loading}
                                    onClick={this.showAddDialog}/>
                        </Tooltip>
                        : null}
                    <Tooltip title="刷新">
                        <Button type="primary" shape="circle" icon="reload"
                                className="pull-right"
                                loading={this.state.loading}
                                onClick={this.refresh}/>
                    </Tooltip>
                </div>
                {this.state.loading ?
                    <div className="w-full center"><Spin/></div>
                    : (this.state.data ?
                        <div>
                            <Descriptions column={6} bordered>
                                <Descriptions.Item label="名字" span={2}>{this.state.data.userName}</Descriptions.Item>
                                <Descriptions.Item label="电话" span={2}>{this.state.data.telNumber}</Descriptions.Item>
                                <Descriptions.Item label="邮政编码" span={2}>{this.state.data.postalCode}</Descriptions.Item>
                                <Descriptions.Item label="省份" span={2}>{this.state.data.provinceName}</Descriptions.Item>
                                <Descriptions.Item label="城市" span={2}>{this.state.data.cityName}</Descriptions.Item>
                                <Descriptions.Item label="区/县/镇" span={2}>{this.state.data.countyName}</Descriptions.Item>
                                <Descriptions.Item label="国家编码" span={6}>{this.state.data.nationalCode}</Descriptions.Item>
                                <Descriptions.Item label="详细地址" span={6}>{this.state.data.detailInfo}</Descriptions.Item>
                            </Descriptions>
                            <Row>
                                <Col span={12}>
                                    <div className="w-full center ma-s">
                                        <Button type="primary" onClick={this.showModifyDialog}>修改</Button>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="w-full center ma-s">
                                        <Button type="danger" onClick={this.handleDelete}>删除</Button>
                                    </div>
                                </Col>
                            </Row>
                        </div> : null)
                }
                <Modal
                    title="添加地址"
                    visible={this.state.dialogAddVisible}
                    footer={[
                        <Button key="back" onClick={this.handleAddCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleAddCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleAddCancel}>
                    <AddDialog
                        visible={this.state.dialogAddVisible}
                        ref={this.saveAddDialogRef}/>
                </Modal>
                <Modal
                    title="修改地址"
                    visible={this.state.dialogModifyVisible}
                    footer={[
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handleDelete}>删除</Button>,
                        <Button key="back" onClick={this.handleModifyCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleModifyCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleModifyCancel}>
                    <ModifyDialog
                        visible={this.state.dialogModifyVisible}
                        record={this.state.data}
                        ref={this.saveModifyDialogRef}/>
                </Modal>
                <Modal
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.state.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除{this.state.deleteCols}条数据？</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAddressPanel);