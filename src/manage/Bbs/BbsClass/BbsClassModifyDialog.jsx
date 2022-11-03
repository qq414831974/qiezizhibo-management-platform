import React from 'react';
import {
    Form,
    Input,
    Select,
    Avatar,
    Tooltip,
    Icon, Upload,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllDefaultUser, uploadimg} from "../../../axios";
import {message} from "antd/lib/index";
import defultAvatar from "../../../static/avatar.jpg";


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

class BbsClassModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                        {getFieldDecorator('name', {
                            initialValue: record.name,
                            rules: [{required: true, message: '请输入名字'}],
                        })(
                            <Input placeholder='请输入名字'/>
                        )}
                    </FormItem>
                    <FormItem style={{margin: 0}}>
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden={true}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsClassModifyDialog);