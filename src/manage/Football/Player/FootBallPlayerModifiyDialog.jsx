import React from 'react';
import {
    Form,
    Input,
    Icon,
    Select,
    DatePicker,
    Col,
    TreeSelect,
    Upload,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../axios";

import defultAvatar from '../../../static/avatar.jpg';

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

},{
    title: '教练',
    value: 'co',
},{
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

const position = {}
position["b"] = [{title: "右边后卫", value: "rwb"}, {title: "右后卫", value: "rb"},
    {title: "右中后卫", value: "rcb"}, {title: "中后卫", value: "cb"}, {title: "左中后卫", value: "lcb"},
    {title: "左后卫", value: "lb"}, {title: "左边后卫", value: "lwb"}, {title: "攻击型后卫", value: "ab"},
    {title: "清道夫", value: "sw"},];
position["m"] = [{title: "右后腰", value: "rcdm"}, {title: "后腰", value: "cdm"},
    {title: "左后腰", value: "lcdm"}, {title: "右边中场", value: "rwm"}, {title: "右中场", value: "rm"},
    {title: "右中中场", value: "rcm"}, {title: "中中场", value: "cm"}, {title: "左中中场", value: "lcm"},
    {title: "左中场", value: "lm"}, {title: "左边中场", value: "lwm"}, {title: "右前腰", value: "rcam"},
    {title: "前腰", value: "cam"}, {title: "左前腰", value: "lcam"},];
position["f"] = [{title: "前锋", value: "f"}, {title: "右前锋", value: "rf"}, {title: "中前锋", value: "cf"},
    {title: "左前锋", value: "lf"}, {title: "右边锋", value: "rw"}, {title: "右中锋", value: "rs"},
    {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},];

class FootBallPlayerModifyDialog extends React.Component {
    state = {
        position: undefined,
    }

    componentDidMount() {
        //receiveData({record: this.props.record}, 'responsive');
    }

    onSelectChange = (position) => {
        this.setState({position: position});
    }
    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                            {getFieldDecorator('headImg', {
                                // initialValue: logo,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('headImg')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            headImg: file.response
                                        })
                                    }
                                }
                            })(
                                <Upload
                                    accept="image/*"
                                    action={uploadimg}
                                    listType="picture-card"
                                    withCredentials={true}
                                    showUploadList={false}
                                    onChange={this.handleAvatarChange}
                                >
                                    {
                                        <img
                                            src={form.getFieldValue('headImg') ? form.getFieldValue('headImg') :
                                                (record.headImg?record.headImg:defultAvatar)}
                                            alt="avatar"
                                            className="round-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                            {getFieldDecorator('name', {
                                initialValue: record.name,
                                rules: [{required: true, message: '请输入名字'}],
                            })(
                                <Input placeholder='请输入名字'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="英文名" className="bs-form-item">
                            {getFieldDecorator('englishName', {
                                initialValue: record.englishName,
                            })(
                                <Input placeholder='请输入英文名'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="位置" className="bs-form-item">
                            {getFieldDecorator('position', {
                                initialValue: record.position,
                                // rules: [{required: true, message: '请选择位置!'}],
                            })(
                                <TreeSelect treeData={positionData}
                                            placeholder="请选择"
                                            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                            onChange={this.onSelectChange}
                                            allowClear
                                            multiple
                                            filterTreeNode={(inputValue, treeNode) => {
                                                return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue)!= -1  ;
                                            }}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="国籍" className="bs-form-item">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('country', {
                                        initialValue: record.country,
                                    })(
                                        <Input placeholder='请输入国家'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>
                                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                                </span>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('city', {
                                        initialValue: record.city,
                                    })(
                                        <Input placeholder='请输入城市'/>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="生日" className="bs-form-item">
                            {getFieldDecorator('birthdate', {
                                initialValue: record.birthdate?moment(record.birthdate):null,
                            })(
                                <DatePicker placeholder='请输入生日' format={'YYYY-MM-DD'}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="性别" className="bs-form-item">
                            {getFieldDecorator('sex', {
                                initialValue: record.sex,
                            })(
                                <Select style={{maxWidth: 150}}>
                                    <Select.Option value={1}>男</Select.Option>
                                    <Select.Option value={0}>女</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="身高" className="bs-form-item">
                            {getFieldDecorator('height', {
                                initialValue: record.height,
                            })(
                                <Input style={{maxWidth: 150}} placeholder='请输入身高'
                                       addonAfter={<p style={{width: 20, marginBottom: 0}}>cm</p>}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="体重" className="bs-form-item">
                            {getFieldDecorator('weight', {
                                initialValue: record.weight,
                            })(
                                <Input style={{maxWidth: 150}} placeholder='请输入体重'
                                       addonAfter={<p style={{width: 20, marginBottom: 0}}>kg</p>}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                            {getFieldDecorator('remark', {
                                initialValue: record.remark,
                            })(
                                <Input.TextArea placeholder='备注'/>
                            )}
                        </FormItem>
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('id', {
                                initialValue: record.id,
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallPlayerModifyDialog);