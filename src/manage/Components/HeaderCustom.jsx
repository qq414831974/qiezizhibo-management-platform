import React, {Component} from 'react';
import {Menu, Icon, Layout, Badge, Popover} from 'antd';
import screenfull from 'screenfull';
import {loginout} from '../../axios/index';
import {queryString} from '../../utils/index';
import avatar from '../../static/avatar.jpg';
import SiderCustom from './SiderCustom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getUser} from "../../utils/tools";

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: false,
    };

    componentDidMount() {
        const _user = getUser() || '测试';
        this.setState({
            user: _user
        });
    };

    screenFull = () => {
        if (screenfull.enabled) {
            if (screenfull.isFullscreen) {
                screenfull.exit();
            } else {
                screenfull.request();
            }
            this.setState({isFullscreen: !screenfull.isFullscreen});
        }
    };
    menuClick = e => {
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        loginout().then((data) => {
            // localStorage.removeItem('user');
            this.props.history.push('/login')
        });
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    render() {
        const {responsive, path} = this.props;
        const userAvatar = this.state.user ? (this.state.user.avatar ? this.state.user.avatar : avatar) : avatar;
        const userName = this.state.user ? (this.state.user.name ? this.state.user.name : "qiezi") : "qiezi";
        return (
            <Header style={{background: '#fff', padding: 0, height: 55}} className="custom-theme">
                {
                    // responsive.data.isMobile ? (
                    //     <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                    //         <Icon type="bars" className="trigger custom-trigger" />
                    //     </Popover>
                    // ) : (
                    <Icon
                        className="trigger custom-trigger"
                        type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.props.toggle}
                    />
                    // )
                }
                <Menu
                    mode="horizontal"
                    style={{lineHeight: '54px', float: 'right'}}
                    onClick={this.menuClick}
                >
                    <Menu.Item key="full" onClick={this.screenFull}
                               hidden={responsive.data.isMobile}>
                        <Icon type={this.state.isFullscreen ? "fullscreen-exit" : "fullscreen"} style={{fontSize: 15}}
                              onClick={this.screenFull}/>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <Badge count={0} overflowCount={10} style={{marginLeft: 10}}>
                            <Icon type="notification"/>
                        </Badge>
                    </Menu.Item>
                    <SubMenu
                        title={<span className="avatar"><img src={userAvatar} alt="头像"/><i
                            className="on bottom b-white"/></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {userName}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
        )
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(HeaderCustom));
