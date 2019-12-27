import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect,
} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getRoleList} from "../../axios";
import {message} from "antd/lib/index";


const TreeNode = TreeSelect.TreeNode;

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class UserAddDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
        if (this.props.visible) {
            getRoleList().then((data) => {
                if (data && data.length >= 1) {
                    this.setState({
                        data: data,
                        loading: false,
                    });
                } else {
                    message.error('获取权限信息失败：' + (data ? data.code + ":" + data.msg : data), 3);
                }
            });
        }
    }

    getTreeNode = (data) => {
        let dom = [];
        if (data) {
            data.forEach((item, index) => {
                dom.push(<TreeNode value={item.menuCode} title={item.name} key={item.menuCode}>
                    {item.childMenu ? this.getTreeNode(item.childMenu) : null}
                </TreeNode>)
            });
        }
        return dom;
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const getTreeNode = this.getTreeNode;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('roleName', {
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="权限"
                              className="bs-form-item-nowrap">
                        {getFieldDecorator('menuList', {
                            rules: [{required: true, message: '请选择权限!'}],
                        })(
                            <TreeSelect disabled={this.state.loading}
                                        placeholder="请选择"
                                        dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                        allowClear
                                        multiple
                                        treeCheckable={true}
                                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                        filterTreeNode={(inputValue, treeNode) => {
                                            return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue) != -1;
                                        }}>
                                {getTreeNode(this.state.data)}
                            </TreeSelect>
                        )}
                        <Icon className="ml-s" style={{fontSize: 16}} type="loading" hidden={!this.state.loading}/>
                    </FormItem>
                </Form>
                :
                null
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAddDialog);