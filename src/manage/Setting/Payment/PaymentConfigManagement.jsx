import React from 'react';
import {Row, Col, Card, Descriptions, Spin, Tooltip, Button, message, Modal, Form} from 'antd';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {
    getPaymentConfig,
    updatePaymentConfig,
} from "../../../axios/index";
import UserAbilityAddDialog from "./PaymentConfigAddDialog"
import UserAbilityModifyDialog from "./PaymentConfigModifyDialog"
import {Link} from "react-router-dom";
import BreadcrumbCustom from "../../Components/BreadcrumbCustom";
import {getQueryString} from "../../../utils";

class PaymentConfigManagement extends React.Component {
    state = {
        loading: false,
        data: null,
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.setState({loading: true})
        getPaymentConfig().then(data => {
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
            updatePaymentConfig(values).then((data) => {
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
            updatePaymentConfig(values).then((data) => {
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

    render() {
        const AddDialog = Form.create()(UserAbilityAddDialog);
        const ModifyDialog = Form.create()(UserAbilityModifyDialog);
        const isToolbox = getQueryString(this.props.location ? this.props.location.search : "", "toolbox");

        return (
            <div className="gutter-example">
                {isToolbox ? null : <BreadcrumbCustom second="支付设置"/>}
                <Card>
                    <div className="mb-m" style={{minHeight: 32}}>
                        {this.state.data == null ?
                            <Tooltip title="新增">
                                <Button type="primary" shape="circle" icon="plus"
                                        className="pull-left"
                                        disabled={this.state.loading}
                                        onClick={this.showAddDialog}/>
                            </Tooltip>
                            : null}
                    </div>
                    {this.state.loading ?
                        <div className="w-full center"><Spin/></div>
                        : (this.state.data ?
                            <div>
                                <Descriptions column={6} bordered title="茄子TV">
                                    <Descriptions.Item label="支付"
                                                       span={6}>{this.state.data.enablePay ? "开启" : "关闭"}</Descriptions.Item>
                                    <Descriptions.Item label="礼物"
                                                       span={6}>{this.state.data.enableGift ? "开启" : "关闭"}</Descriptions.Item>

                                </Descriptions>
                                <Descriptions column={6} bordered title="茄子FC" className="mt-l">
                                    <Descriptions.Item label="支付"
                                                       span={6}>{this.state.data.enablePayFc ? "开启" : "关闭"}</Descriptions.Item>
                                    <Descriptions.Item label="礼物"
                                                       span={6}>{this.state.data.enableGiftFc ? "开启" : "关闭"}</Descriptions.Item>

                                </Descriptions>
                                <Row>
                                    <Col span={24}>
                                        <div className="w-full center ma-s">
                                            <Button type="primary" onClick={this.showModifyDialog}>修改</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div> : null)
                    }
                </Card>
                <Modal
                    title="添加能力"
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
                    title="修改能力"
                    visible={this.state.dialogModifyVisible}
                    footer={[
                        <Button key="back" onClick={this.handleModifyCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleModifyCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleModifyCancel}>
                    <ModifyDialog
                        visible={this.state.dialogModifyVisible}
                        record={this.state.data}
                        ref={this.saveModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfigManagement);