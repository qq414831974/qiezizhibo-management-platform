import React from 'react';
import {
    Form,
    Input,
    Icon,
} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message} from "antd/lib/index";



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

class AreasAddDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('province', {
                            rules: [{required: true, message: '请输入省份!'}],
                        })(
                            <Input placeholder='请输入省份!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AreasAddDialog);