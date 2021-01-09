import React from 'react';
import {Row, Col, Card, Descriptions, Spin, Tooltip, Button, message, Modal, Form} from 'antd';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {
    getUserExp,
    addUserExp,
} from "../../../axios/index";
import UserExpModifyDialog from "./UserExpModifyDialog"
import {Link} from "react-router-dom";

class UserExpPanel extends React.Component {
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
        getUserExp({userNo: this.props.userNo}).then(data => {
            this.setState({data: data.data, loading: false})
        })
    }
    refresh = () => {
        this.fetch();
    }
    saveModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.userNo = this.props.userNo
            if(!Number.isInteger(values.coinCount) != Number(values.coinCount) || !Number.isInteger(values.exp) != Number(values.exp)){
                message.warn("请输入正确的数字", 1);
                return;
            }
            values.coinCount = values.coinCount * 100
            addUserExp(values).then((data) => {
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
        const ModifyDialog = Form.create()(UserExpModifyDialog);
        return (
            <div>
                <div className="mb-m" style={{minHeight: 32}}>
                    <Tooltip title="刷新">
                        <Button type="primary" shape="circle" icon="reload"
                                className="pull-right"
                                loading={this.state.loading}
                                onClick={this.refresh}/>
                    </Tooltip>
                </div>
                {this.state.loading ?
                    <div className="w-full center"><Spin/></div>
                    : <div>
                         <Descriptions column={6} bordered>
                             <Descriptions.Item label="等级" span={6}>{`${this.state.data && this.state.data.level ? this.state.data.level : "未知"} 级`}</Descriptions.Item>
                             <Descriptions.Item label="经验" span={3}>{this.state.data && this.state.data.exp ? this.state.data.exp :0}</Descriptions.Item>
                             <Descriptions.Item label="充值金额" span={3}>{`${this.state.data && this.state.data.coinCount ? this.state.data.coinCount / 100 :0} 茄币`}</Descriptions.Item>
                         </Descriptions>
                         <div className="w-full center ma-s">
                             <Button type="primary" onClick={this.showModifyDialog}>修改</Button>
                         </div>
                    </div>
                }
                <Modal
                    title="修改经验"
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

export default connect(mapStateToProps, mapDispatchToProps)(UserExpPanel);