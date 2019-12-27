import React from 'react';
import {Modal, Form, Input, Checkbox, Avatar, Icon, Select, DatePicker, Col, message, Button, Radio, Tabs} from 'antd';
import {parseTimeString} from '../../utils/index'
import moment from 'moment'
import 'moment/locale/zh-cn';
import copy from "copy-to-clipboard/index";
import {trim} from '../../utils';
import LiveSimpleForm from '../Live/LiveSimpleForm';
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

    saveLiveSimpleRef = (form) => {
        this.formSimple = form;
    };

    render() {
        const {visible, onCancel, onCreate, record} = this.props;
        // const record = this.props.responsive.record;
        const LiveSimple = Form.create()(LiveSimpleForm);
        return (
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
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Tab 1" key="1">
                        <LiveSimple visible={visible} record={record} ref={this.saveLiveSimpleRef}/>
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                </Tabs>
                {record.createdAt ?
                    <p className={'pull-right'}>创建时间：{parseTimeString(record.createdAt)}</p> : ""}
            </Modal>
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