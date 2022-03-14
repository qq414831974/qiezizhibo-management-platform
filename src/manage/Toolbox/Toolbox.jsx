import React from 'react';
import DocumentTitle from 'react-document-title';
import {Row, Col, Layout, Icon} from 'antd';

import Routes from '../../routes/toolbox';
import {getRole, getUser} from "../../utils/tools";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";

const {Header, Content, Footer} = Layout;

class Toolbox extends React.Component {
    state = {};

    componentWillMount() {
        const {receiveData} = this.props;
        const user = getUser();
        receiveData(user, 'auth');
        const roles = getRole();
        receiveData(roles, 'role');
        let permissionList = [];
        for (let roleKey in roles) {
            if (roles[roleKey]) {
                const permissions = roles[roleKey].permissions
                permissionList = permissionList.concat(permissions);
            }
        }
        receiveData(permissionList, 'permission');
    }

    render() {
        const {auth, responsive, permission} = this.props;
        if (permission.data == null || permission.data.length == 0) {
            return <div/>
        }
        return (
            <DocumentTitle title="工具箱">
                <Layout>
                    <Header style={{padding: "0 20px"}}>
                        <div style={{fontSize: 24, color: "#ffffff"}} onClick={() => {
                            this.props.history.goBack();
                        }}>
                            <Icon type="left"/>
                        </div>
                    </Header>
                    <Content style={{
                        overflowY: "scroll",
                        overflowX: "hidden",
                        background: '#ffffff',
                        boxSizing: "border-box"
                    }}>
                        <Routes permissions={permission.data}/>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        <div>©2022 茄子直播</div>
                    </Footer>
                </Layout>
            </DocumentTitle>
        )
    }
}
const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}, role = {data: []}, permission = {data: []}} = state.httpData;
    return {auth, responsive, role, permission};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);