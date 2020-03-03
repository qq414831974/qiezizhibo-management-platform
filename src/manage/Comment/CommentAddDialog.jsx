import React from 'react';
import {
    Form,
    Input,
    Select,
    Avatar,
    Icon,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllDefaultUser} from "../../axios";
import {message} from "antd/lib/index";


const Option = Select.Option;
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

class CommentAddDialog extends React.Component {
    state = {}

    componentDidMount() {
        this.props.visible && this.fetch();
    }

    fetch = () => {
        this.setState({loading: true});
        getAllDefaultUser().then((data) => {
            if (data && data.code ==200 && data.data) {
                this.setState({
                    data: data.data,
                    loading: false,
                });
            } else {
                message.error('获取预设用户失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getUserSelectDom = () => {
        let dom = [];
        const data = this.state.data;
        data && data.forEach((item, index) => {
            dom.push(<Option value={item.userNo} key={"userNo-" + item.userNo}>
                <div className="inline">
                    <Avatar className="inline-block" src={item.avatar}/>
                    <span className="inline-block ml-s mt-n mb-n">{item.name}</span>
                </div>
            </Option>);
        });
        return dom;
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="用户" className="bs-form-item-nowrap">
                        {getFieldDecorator('userNo', {})(
                            <Select disabled={this.state.loading} size="large" style={{minWidth: 150}}>
                                <Option value={null} key={"userNo-" + 0}>匿名</Option>
                                {this.getUserSelectDom()}
                            </Select>
                        )}
                        <Icon className="ml-s" style={{fontSize: 16}} type="loading" hidden={!this.state.loading}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('status', {
                            initialValue: 1,
                        })(
                            <Select style={{minWidth: 150}}>
                                <Option value={0} key={"status-" + 0}>未审核</Option>
                                <Option value={1} key={"status-" + 1}>已审核</Option>
                                <Option value={2} key={"status-" + 2}>已禁用</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="内容" className="bs-form-item">
                        {getFieldDecorator('content', {
                            rules: [{required: true, message: '请输入内容!'}],
                        })(
                            <Input.TextArea placeholder='内容'/>
                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentAddDialog);