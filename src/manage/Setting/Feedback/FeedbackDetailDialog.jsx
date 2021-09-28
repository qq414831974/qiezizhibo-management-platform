import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    TreeSelect, Select, Tooltip, message, Avatar, Descriptions, Button, Modal
} from 'antd';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import {
    getFeedbackById,
} from "../../../axios";
import {Link} from 'react-router-dom';

class FeedbackDetailDialog extends React.Component {
    state = {
        loading: false,
        userloading: false,
        data: [],
        teamdata: [],
        userdata: [],
        match: {},
        team: {},
        user: {}
    }
    isCompositions = true;
    isTeamCompositions = true;
    isUserCompositions = true;

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({loading: true});
        const id = this.props.id;
        getFeedbackById({id: id}).then((data) => {
            if (data && data.data) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取投诉反馈信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getTypeText = (status) => {
        let text = ""
        switch (status) {
            case 1:
                text = "功能异常";
                break;
            case 2:
                text = "支付问题";
                break;
            case 3:
                text = "产品建议";
                break;
            case 4:
                text = "违规举报";
                break;
            case 5:
                text = "交易问题";
                break;
        }
        return text;
    }

    render() {
        const {visible, needRedirect, afterRedirect} = this.props;
        return (
            visible ?
                <div>
                    {needRedirect ? <div className="w-full center mb-l">
                        <Button onClick={afterRedirect} type="primary"><Link to="/sys/feedback">跳转到相关页面</Link></Button>
                    </div> : null}
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="类型">
                            <span>
                                {this.state.data && this.state.data.type ? this.getTypeText(this.state.data.type) : "未知"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="内容">
                            <span>
                                {this.state.data && this.state.data.value ? this.state.data.value : "无"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="图片">
                            <div className="w-full">
                                {this.state.data && this.state.data.picList && this.state.data.picList.map((data, index) => {
                                    return <img key={index} src={data} style={{
                                        height: "auto",
                                        width: "100%",
                                        padding: "10px",
                                        boxSizing: "border-box"
                                    }}/>
                                })}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions column={1} bordered className="mt-l">
                        <Descriptions.Item label="用户id">
                            <span>
                                {this.state.data && this.state.data.userNo ? this.state.data.userNo : "未知"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="手机号">
                            <span>
                                {this.state.data && this.state.data.phone ? this.state.data.phone : "未知"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            <span>
                                {this.state.data && this.state.data.createTime ? this.state.data.createTime : "未知"}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetailDialog);