import React from 'react';
import {Modal, Form, Input, Checkbox, Avatar, Icon, Select, DatePicker, Col, message, Button, Radio, Tabs} from 'antd';
import {parseTimeString} from '../../utils/index'
import moment from 'moment'
import 'moment/locale/zh-cn';
import copy from "copy-to-clipboard/index";
import {trim} from '../../utils';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
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

class LiveModifyDialog extends React.Component {
    state = {
        peopleShow: false,
    }

    componentDidMount() {
        receiveData({record: this.props.record}, 'responsive');
    }

    render() {
        const {visible, onCancel, onCreate, form, record} = this.props;
        const {getFieldDecorator} = form;
        // const record = this.props.responsive.record;
        const stream = record && visible ? record.stream : "";
        const streamUrl = record && visible ? "rtmp://push.shangzhibo.tv/" + record.app + "/" + stream : "";
        // const fake = record ? JSON.parse(trim(record.fake.toString())):{};
        return (
            visible ?
                <Modal
                    width={1000}
                    visible={visible}
                    title={<div className={'inline-p'}><Icon type="play-circle-o"/><p>{record.name}</p></div>}
                    // title="修改信息"
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                    destroyOnClose="true"
                >
                    <Form>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Tab 1" key="1">
                                <FormItem {...formItemLayout} className="bs-form-item">
                                    {getFieldDecorator('id', {
                                        initialValue: record.id,
                                    })(
                                        <p hidden={true}/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                                    {getFieldDecorator('name', {
                                        initialValue: record.name,
                                        rules: [{required: true, message: '请输入直播名称!'}],
                                    })(
                                        <Input placeholder={record.name}/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="时间" className="bs-form-item">
                                    <Col span={6}>
                                        <FormItem>
                                            {getFieldDecorator('startedAt', {
                                                initialValue: moment(record.startedAt),
                                                rules: [{required: true, message: '请选择时间!'}],
                                            })(
                                                <DatePicker showTime
                                                            format={'YYYY-MM-DD HH:mm'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={2}>
                            <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                            -
                            </span>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem>
                                            {getFieldDecorator('endedAt', {
                                                initialValue: moment(record.endedAt),
                                                rules: [{required: true, message: '请选择时间!'}],
                                            })(
                                                <DatePicker showTime
                                                            format={'YYYY-MM-DD HH:mm'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </FormItem>
                                <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                                    <Col span={4}>
                                        <FormItem>
                                            {getFieldDecorator('status', {
                                                initialValue: record.status,
                                            })(
                                                <Select>
                                                    <Select.Option value="enabled">可用</Select.Option>
                                                    <Select.Option value="disabled">已结束</Select.Option>
                                                    <Select.Option value="forbidden">已禁用</Select.Option>
                                                    <Select.Option value="deleted">已删除</Select.Option>
                                                </Select>
                                            )}

                                        </FormItem>
                                    </Col>
                                </FormItem>
                                <FormItem {...formItemLayout} label="推流链接" colon={true} className="bs-form-item">
                                    <Col span={23}>
                                        <FormItem>
                                            {getFieldDecorator('streamUrl', {
                                                initialValue: streamUrl,
                                            })(
                                                <Input disabled={true} className="cursor-text"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={1}>
                                        <Icon type="copy" style={{fontSize: 16}} onClick={() => {
                                            copy(streamUrl);
                                            message.success('推流链接已复制到剪贴板');
                                        }}/>
                                    </Col>
                                </FormItem>
                                <FormItem {...formItemLayout} label="正在推流" className="bs-form-item">
                                    {getFieldDecorator('isPushing', {
                                        initialValue: record.isPushing,
                                    })(
                                        <RadioGroup disabled={true}>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="启用预设视频" className="bs-form-item">
                                    {getFieldDecorator('isPrologueEnabled', {
                                        initialValue: record.isPrologueEnabled,
                                    })(
                                        <RadioGroup>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="启用录播视频" className="bs-form-item">
                                    {getFieldDecorator('isBackupRecordEnabled', {
                                        initialValue: record.isBackupRecordEnabled,
                                    })(
                                        <RadioGroup>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="播放页直播" className="bs-form-item">
                                    {getFieldDecorator('isLiveEnabled', {
                                        initialValue: record.isLiveEnabled,
                                    })(
                                        <RadioGroup>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="观看人数" className="bs-form-item">
                                    <p className="mb-zero">{record.fake.baseCount}</p>
                                </FormItem>
                                <FormItem {...formItemLayout} label="启用人数放大" className="bs-form-item">
                                    <Col span={4}>
                                        <FormItem>
                                            {getFieldDecorator('isFakeEnabled', {
                                                initialValue: record.isFakeEnabled,
                                            })(
                                                <RadioGroup onChange={(e) => {
                                                    this.setState({peopleShow: e.target.value})
                                                }}>
                                                    <Radio value={true}>是</Radio>
                                                    <Radio value={false}>否</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {this.state.peopleShow ?
                                        <Col span={7}>
                                            <FormItem>
                                                {getFieldDecorator('increaseMin', {
                                                    initialValue: record.fake.increaseMin,
                                                    rules: [{required: true, message: '请输入最小值!'}],
                                                })(
                                                    <Input/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        :
                                        <div/>
                                    }
                                    {this.state.peopleShow ?
                                        <Col span={1}>
                                        <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                                        -
                                        </span>
                                        </Col>
                                        :
                                        <div/>
                                    }
                                    {this.state.peopleShow ?
                                        < Col span={7}>
                                            <FormItem>
                                                {getFieldDecorator('increaseMax', {
                                                    initialValue: record.fake.increaseMax,
                                                    rules: [{required: true, message: '请输入最大值!'}],
                                                })(
                                                    <Input/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        :
                                        <div/>
                                    }
                                </FormItem>
                            </TabPane>
                            <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                            <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                        </Tabs>
                    </Form>
                    {record.createdAt ?
                        <p className={'pull-right'}>创建时间：{parseTimeString(record.createdAt)}</p> : ""}
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveModifyDialog);