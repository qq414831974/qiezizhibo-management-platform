/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from 'react';
import {Layout, Avatar} from 'antd';
import {withRouter} from 'react-router-dom';
import {menus_admin} from '../constants/menus-admin';
import SiderMenu from './SiderMenu';
import {connect} from 'react-redux';
import logo from '../../static/logo.png';

const {Sider} = Layout;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };

    componentDidMount() {
        this.setMenuOpen(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }

    setMenuOpen = props => {
        const {pathname} = props.location;
        this.setState({
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key,
        });
        const {popoverHide} = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
        if (this.props.responsive.data.isMobile) {
            this.props.ontoggle();
        }
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    getMenu = () => {
        const menus = [];
        const subMenuAvailable = (menu) => {
            const subMenus = [];
            menu.sub.map(subMenu => {
                if (subMenu.public) {
                    subMenus.push(subMenu);
                } else if (this.ifMenuIsAvailable(subMenu)) {
                    subMenus.push(subMenu);
                }
            })
            if (subMenus.length > 0) {
                return subMenus;
            }
            return null;
        }
        menus_admin.map(menu => {
            if (menu.public) {
                if (menu.sub) {
                    const submenu = subMenuAvailable(menu);
                    if (submenu) {
                        menu.sub = submenu;
                        menus.push(menu);
                    }
                } else {
                    menus.push(menu);
                }
            } else if (menu.sub) {
                const submenu = subMenuAvailable(menu);
                if (submenu) {
                    menu.sub = submenu;
                    menus.push(menu);
                }
            } else if (this.ifMenuIsAvailable(menu)) {
                menus.push(menu);
            }
        });
        return menus;
    }
    ifMenuIsAvailable = (menu) => {
        if (this.props.permission.data) {
            return this.props.permission.data.indexOf(menu.key) > -1
        }
        return false;
    }

    render() {
        const {responsive, path} = this.props;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}
                width={160}
                collapsedWidth={responsive.data.isMobile ? 0 : 80}
            >
                <div className="logo center"><img src={logo} height={50} width={50}/></div>
                <SiderMenu
                    menus={this.getMenu()}
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={this.state.firstHide ? null : [this.state.openKey]}
                    onOpenChange={this.openMenu}
                />
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}, auth = {data: {}}, role = {data: []}, permission = {data: []}} = state.httpData;
    return {responsive, auth, role, permission};
};

export default withRouter(connect(mapStateToProps)(SiderCustom));


// export default withRouter(SiderCustom);