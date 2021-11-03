import React from 'react';
import DocumentTitle from 'react-document-title';
import {Row, Col, Layout} from 'antd';


import vip_card from '../../static/vip-card.png'
import pay_item from '../../static/pay-item.png'

const {Header, Content, Footer} = Layout;

class ToolboxDashboard extends React.Component {
    state = {};

    onLeagueMemberClick = () => {
        this.props.history.push('/toolbox/leagueMember?toolbox=true');
    }
    onPaySettingClick = () => {
        this.props.history.push('/toolbox/paySetting?toolbox=true');
    }

    render() {
        return (
            <Row gutter={[16, 16]} className="pa-l" style={{boxSizing: "border-box", overflow: "hidden"}}>
                <Col span={8}>
                    <div className="toolbox-item" onClick={this.onPaySettingClick}>
                        <div className="w-full center">
                            <img src={pay_item} alt="支付设置"/>
                        </div>
                        <div className="w-full center">
                            <span>支付设置</span>
                        </div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="toolbox-item" onClick={this.onLeagueMemberClick}>
                        <div className="w-full center">
                            <img src={vip_card} alt="联赛会员"/>
                        </div>
                        <div className="w-full center">
                            <span>联赛会员</span>
                        </div>
                    </div>
                </Col>
                <Col span={8}>

                </Col>
            </Row>
        )
    }
}

export default ToolboxDashboard;