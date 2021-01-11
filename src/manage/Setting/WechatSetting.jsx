import React from 'react';
import {Row, Col, Divider, message, Input, Button, Select} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";

class WechatSetting extends React.Component {
    state = {}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        // getConfig().then((data) => {
        //     if (data) {
        //         this.setState({hotloader: data.config});
        //     } else {
        //         message.error('获取系统配置失败：' + (data ? data.result + "-" + data.msg : data), 3);
        //     }
        // });
    }
    onInputChange = (e) => {
        this.setState({hotloader: e.target.value});
    }
    onWxSubmitClick = () => {
        // setConfig({
        //     value: this.state.hotloader,
        //     code: "hotloader"
        // }).then((data) => {
        //     if (data && data.code == 200) {
        //         if (data.data) {
        //             message.success(`微信配置保存成功`, 1);
        //         } else {
        //             message.warn(data.msg, 1);
        //         }
        //     } else {
        //         message.error(`微信配置保存失败` + (data ? data.code + ":" + data.msg : data), 3);
        //     }
        // });
    }
    refresh = () => {
        this.fetch();
    }

    render() {
        return (
            <div>
                <BreadcrumbCustom first="系统设置"/>
                <Divider>小程序设置(不要随便改)</Divider>
                <Input.TextArea autosize={{minRows: 3, maxRows: 100}} onChange={this.onInputChange}
                                value={this.state.hotloader}/>
                <Button onClick={this.onWxSubmitClick}>保存</Button>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(WechatSetting);