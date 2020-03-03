import React from 'react';
import {Table, Button, Modal, Tooltip} from 'antd';
import {getAreasList, createArea, delAreaById} from '../../axios/index';
import {Form, message} from "antd/lib/index";
import AreasAddDialog from './AreasAddDialog';
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


class AreasTable extends React.Component {
    state = {
        data: [],
        loading: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch();
    };

    fetch = () => {
        this.setState({loading: true});
        getAreasList().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    deleteArea = () => {
        delAreaById({id: this.state.record.id}).then((data) => {
            this.setState({deleteVisible: false});
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
        this.handleAreasDelete();
    }
    saveAreasAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showAreasAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleAreasAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleAreasAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            createArea(values).then((data) => {
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

    handleAreasDelete = () => {
        this.setState({deleteVisible: true,});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const AddDialog = Form.create()(AreasAddDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            width: '90%',
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
                                               onClick={this.showAreasAddDialog}/>
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
                title="添加地区"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleAreasAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleAreasAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleAreasAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveAreasAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.deleteArea}
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

export default connect(mapStateToProps, mapDispatchToProps)(AreasTable);