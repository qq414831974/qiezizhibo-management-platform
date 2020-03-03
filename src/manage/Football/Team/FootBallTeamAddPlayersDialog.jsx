import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    TreeSelect,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import avatar from '../../../static/avatar.jpg';

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
const positionData = [{
    title: '门将',
    value: 'gk',

}, {
    title: '教练',
    value: 'co',
}, {
    title: '后卫',
    value: 'b',
    children: [{title: "右边后卫", value: "rwb"}, {title: "右后卫", value: "rb"},
        {title: "右中后卫", value: "rcb"}, {title: "中后卫", value: "cb"}, {title: "左中后卫", value: "lcb"},
        {title: "左后卫", value: "lb"}, {title: "左边后卫", value: "lwb"}, {title: "攻击型后卫", value: "ab"},
        {title: "清道夫", value: "sw"},],
}, {
    title: '中场',
    value: 'm',
    children: [{title: "右后腰", value: "rcdm"}, {title: "后腰", value: "cdm"},
        {title: "左后腰", value: "lcdm"}, {title: "右边中场", value: "rwm"}, {title: "右中场", value: "rm"},
        {title: "右中中场", value: "rcm"}, {title: "中中场", value: "cm"}, {title: "左中中场", value: "lcm"},
        {title: "左中场", value: "lm"}, {title: "左边中场", value: "lwm"}, {title: "右前腰", value: "rcam"},
        {title: "前腰", value: "cam"}, {title: "左前腰", value: "lcam"},],
}, {
    title: '前锋',
    value: 'f',
    children: [{title: "右前锋", value: "rf"}, {title: "中前锋", value: "cf"},
        {title: "左前锋", value: "lf"}, {title: "右边锋", value: "rw"}, {title: "右中锋", value: "rs"},
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},],
},
];

class FootBallTeamAddPlayersDialog extends React.Component {
    state = {}

    componentDidMount() {
        //receiveData({record: this.props.record}, 'responsive');
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <div className="center w-full">
                        <img
                            src={record.headImg ? record.headImg : avatar}
                            alt="avatar"
                            className="round-img"/>
                    </div>
                    <div className="center w-full">
                        <p>{record.name}</p>
                    </div>
                    <Form>
                        <FormItem {...formItemLayout} label="球衣号码" className="bs-form-item">
                            {getFieldDecorator('shirtNum', {
                                rules: [{required: true, message: '请输入球衣号码'}],
                            })(
                                <Input placeholder='请输入球衣号码'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="位置" className="bs-form-item">
                            {getFieldDecorator('position', {
                                // rules: [{required: true, message: '请选择位置!'}],
                            })(
                                <TreeSelect treeData={positionData}
                                            multiple
                                            placeholder="请选择"
                                            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                            allowClear
                                            filterTreeNode={(inputValue, treeNode) => {
                                                return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue) != -1;
                                            }}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('status', {
                                initialValue: "3",
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="入队日期" className="bs-form-item">
                            {getFieldDecorator('joinTime', {
                                // initialValue: moment(),
                            })(
                                <DatePicker placeholder='请输入入队日期' format={'YYYY/MM/DD'}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('playerId', {
                                initialValue: record.id,
                            })(
                                <Input hidden={true} />
                            )}
                        </FormItem>
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('teamId', {
                                initialValue: this.props.teamId,
                            })(
                                <Input hidden={true} />
                            )}
                        </FormItem>
                    </Form>
                </div>
                :
                <div/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallTeamAddPlayersDialog);