import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    InputNumber,
    Icon,
    Button,
    Row,
    Col,
    Collapse, Progress, Switch, message, Radio, DatePicker, TreeSelect
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";


const Option = Select.Option;
const {Panel} = Collapse;

moment.locale('zh-cn');

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
const typeData = [
    {
        title: '新增',
        value: 1,
    }, {
        title: '修改',
        value: 2,
    }, {
        title: '删除',
        value: 3,
    }, {
        title: '修改比分',
        value: 4,
    }
];

class LeagueMatchManagementForm extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <span className="w-full center" style={{fontSize: 20}}>
                        {record && record.id != null ? "已设置权限" : <span className="danger">未设置权限</span>}
                    </span>
                    <span className="w-full center mt-s danger">注意：开启前请在联赛中填写好比赛菜单！</span>
                    <FormItem {...formItemLayout} label="权限" className="bs-form-item">
                        {getFieldDecorator('permissions', {
                            initialValue: record.permissions ? record.permissions : [1, 2, 3, 4],
                            rules: [{required: true, message: '请设置权限!'}],
                        })(
                            <TreeSelect treeData={typeData}
                                        style={{minWidth: 300, maxWidth: 300, textAlign: "center"}}
                                        placeholder="请选择"
                                        dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                        allowClear
                                        multiple
                                        filterTreeNode={(inputValue, treeNode) => {
                                            return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value == inputValue;
                                        }}/>
                        )}
                    </FormItem>
                    {record.id ? <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden/>
                        )}
                    </FormItem> : null}
                    <div className="w-full center mt-l">
                        <FormItem wrapperCol={{span: 12, offset: 6}}>
                            <Button loading={this.props.modifyLoading}
                                    type="primary"
                                    htmlType="submit">
                                确定
                            </Button>
                        </FormItem>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueMatchManagementForm);