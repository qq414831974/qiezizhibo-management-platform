import React from 'react';
import {Table, Button, Modal, Tooltip} from 'antd';
import {
    getShareSentenceList,
    createShareSentence,
    updateShareSentence,
    delShareSentenceById
} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import ShareSentenceAddDialog from './ShareSentenceAddDialog';
import ShareSentenceModifyDialog from './ShareSentenceModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


class ShareSentenceTable extends React.Component {
    state = {
        data: [],
        loading: false,
        dialogAddVisible: false,
        dialogModifyVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch();
    };

    fetch = () => {
        this.setState({loading: true});
        getShareSentenceList().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取分享语句列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    deleteShareSentence = () => {
        delShareSentenceById({id: this.state.record.id}).then((data) => {
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
        this.showShareSentenceModifyDialog();
    }
    saveShareSentenceAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showShareSentenceAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleShareSentenceAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    saveShareSentenceModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showShareSentenceModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleShareSentenceModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleShareSentenceAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            createShareSentence(values).then((data) => {
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
    handleShareSentenceModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateShareSentence(values).then((data) => {
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
    handleShareSentenceDelete = () => {
        this.setState({deleteVisible: true,});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const AddDialog = Form.create()(ShareSentenceAddDialog);
        const ModifyDialog = Form.create()(ShareSentenceModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            align: 'center',
        }, {
            title: '语句',
            dataIndex: 'sentence',
            key: 'sentence',
            width: '55%',
            align: 'center',
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                switch (record.type) {
                    case 1:
                        return "比赛";
                    case 2:
                        return "联赛";
                }
                return record.type;
            }
        }, {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
            width: '15%',
            align: 'center',
        }];

        return <div><Table columns={columns}
                           onRow={record => ({onClick: this.onNameClick.bind(this, record)})}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           loading={this.state.loading}
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus"
                                               onClick={this.showShareSentenceAddDialog}/>
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
                title="添加分享语句"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleShareSentenceAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleShareSentenceAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleShareSentenceAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveShareSentenceAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改分享语句"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleShareSentenceDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleShareSentenceModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleShareSentenceModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleShareSentenceModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible}
                              ref={this.saveShareSentenceModifyDialogRef}
                              record={this.state.record}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.deleteShareSentence}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShareSentenceTable);