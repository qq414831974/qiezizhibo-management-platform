import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {Layout, Menu, Dropdown} from 'antd';
import avatar from '../static/avatar.jpg';
import {removeRole, removeUser, removeToken} from '../utils/tools';

class Header extends Component {
    state = {}

    componentWillMount() {

    }

    componentDidMount() {

    }

    logout = () => {
        // loginout().then((data) => {
        // localStorage.removeItem('user');
        removeRole();
        removeUser();
        removeToken();
        this.props.history.push('/manage/login')
        // });
    };

    render() {
        const {responsive} = this.props;
        const userAvatar = this.props.user ? (this.props.user.avatar ? this.props.user.avatar : avatar) : avatar;
        const userName = this.props.user ? (this.props.user.name ? this.props.user.name : "qiezi") : "qiezi";
        const menu = <Menu>
            <Menu.Item key="menu:1">{userName}</Menu.Item>
            <Menu.Item key="menu:2" onClick={this.logout}>退出登录</Menu.Item>
        </Menu>
        return (
            <Layout.Header className="qz-live-header" style={{width: responsive.data.clientWidth}}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <span className="qz-live-header-avatar">
                        <img src={userAvatar} alt="头像"/>
                        <i className="on bottom b-white"/>
                    </span>
                </Dropdown>
                <style>{`
                    ${responsive.data.isMobile ?
                    ".ant-layout-header{ padding: 10px 20px; }"
                    :
                    ".ant-layout-header{ padding: 10px 50px; }"
                }
                `}</style>
            </Layout.Header>
        );
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(Header));
