import React, {Component} from 'react';
import {
    Menu,
    Icon,
    Layout,
    Badge,
    notification,
    message,
    Drawer,
    Tabs,
    Button,
    Skeleton,
    List,
    Avatar,
    Tag,
    Modal
} from 'antd';
import screenfull from 'screenfull';
import {getTodoListCount, getTodoList, readTodo} from '../../axios/index';
import {queryString} from '../../utils/index';
import avatar from '../../static/avatar.jpg';
import SiderCustom from './SiderCustom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getUser, removeUser, removeToken, removeRole} from "../../utils/tools";
import CashOrderDetailDialog from "../Football/Heat/League/CashOrderDetailDialog";
import FeedbackDetailDialog from "../Setting/Feedback/FeedbackDetailDialog";

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const {TabPane} = Tabs;
const IconText = ({type, text, color}) => (
    <span style={{color: color}}>
    <Icon type={type} style={{marginRight: 8}}/>
        {text}
  </span>
);
const sourceTypeMap = {
    0: {text: "系统消息", color: "#2db7f5"},
    1: {text: "投诉反馈", color: "#f44455"},
    2: {text: "提现", color: "#87d068"},
}
const readStatusMap = {
    true: {text: "已读", color: "#108ee9"},
    false: {text: "未读", color: "#f50"},
}

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: false,
        unReadTodoListCount: 0,
        tabActiveKey: "false",
        todoListLoading: false,
    };
    intervalId = null;

    componentDidMount() {
        const _user = getUser();
        this.setState({
            user: _user
        });
        this.queryTodoListCount(true, this);
        this.startTimer();
    };

    componentWillUnmount() {
        this.clearTimer();
    }

    startTimer = () => {
        const that = this;
        this.clearTimer();
        const intervalId = setInterval(() => {
            that.queryTodoListCount(false, that);
        }, 60000);
        this.setState({intervalId: intervalId})
    }
    clearTimer = () => {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId)
            this.setState({intervalId: null})
        }
    }
    queryTodoListCount = (isFirst, context) => {
        getTodoListCount({isRead: false}).then(data => {
            if (data && typeof data.data == "number") {
                if (!isFirst && context.state.unReadTodoListCount < data.data) {
                    context.openTodoListNotification();
                }
                context.setState({unReadTodoListCount: data.data});
            }
        })
    }
    getTodoList = (isRead) => {
        this.setState({todoListLoading: true})
        getTodoList({isRead: isRead, pageSize: 20, pageNum: 1}).then((data) => {
            if (data && data.data && data.data.records) {
                this.setState({todoList: data.data.records, todoListLoading: false});
            } else {
                this.setState({todoList: [], todoListLoading: false});
            }
        })
    }
    refresh = () => {
        this.getTodoList(this.state.tabActiveKey);
        this.queryTodoListCount(false, this);
    }
    openTodoListNotification = () => {
        notification.open({
            top: 64,
            icon: <Icon type="message" style={{color: '#fcc100'}}/>,
            message: '通知',
            description:
                '您有一条新的待办事项，点击查看。',
            onClick: () => {
                this.openTodoListDraw();
            },
        });
    };
    openTodoListDraw = () => {
        this.refresh();
        this.setState({todoListVisible: true})
    }
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
        // loginout().then((data) => {
        //     // localStorage.removeItem('user');
        removeUser();
        removeRole();
        removeToken();
        this.props.history.push('/login')
        // });
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    onTabChange = (key) => {
        this.setState({tabActiveKey: key}, () => {
            this.refresh();
        })
    }
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };
    onTodoListClose = () => {
        this.setState({todoListVisible: false})
    }
    onTodoListItemClick = (item) => {
        if (this.state.user == null || this.state.user.id == null) {
            alert("未登录，请重新登陆");
            return;
        }
        this.setState({
            childrenDrawer: true,
            currentItem: item,
            currentItemType: item.sourceType,
            currentItemId: item.externalId
        })
    }
    onChildrenDrawerClose = () => {
        this.refresh();
        this.setState({childrenDrawer: false, currentItem: null, currentItemType: null, currentItemId: null})
    }
    readTodo = () => {
        if (this.state.user == null || this.state.user.id == null) {
            alert("未登录，请重新登陆");
            return;
        }
        const item = this.state.currentItem;
        if (!item.isRead) {
            readTodo({id: item.id, adminUserId: this.state.user.id}).then(data => {
                if (data && typeof data.data == "boolean" && data.data) {
                    message.success("已读成功")
                } else {
                    message.error("已读失败")
                }
                this.refresh();
            })
        }
    }

    render() {
        const {responsive, path} = this.props;
        const userAvatar = this.state.user ? (this.state.user.avatar ? this.state.user.avatar : avatar) : avatar;
        const userName = this.state.user ? (this.state.user.name ? this.state.user.name : "qiezi") : "qiezi";
        const todoList = <List
            itemLayout="vertical"
            dataSource={this.state.todoList}
            renderItem={item => (
                <List.Item
                    key={item.id}
                    onClick={this.onTodoListItemClick.bind(this, item)}
                    actions={
                        !this.state.todoListLoading && [
                            <IconText type="info-circle"
                                      color={sourceTypeMap[item.sourceType].color}
                                      text={sourceTypeMap[item.sourceType].text} key="info"/>,
                            <IconText type="clock-circle" text={item.createTime} key="time"/>,
                            item.readerName ? <IconText type="user" text={item.readerName} key="name"/> : null,
                        ]
                    }
                    extra={
                        !this.state.todoListLoading && (
                            <Tag color={readStatusMap[item.isRead].color}>{readStatusMap[item.isRead].text}</Tag>
                        )
                    }
                >
                    <Skeleton loading={this.state.todoListLoading} active>
                        <List.Item.Meta
                            title={<a href={item.href}>{item.noticeText}</a>}
                            description={item.detail}
                        />
                        <span style={{color: "rgba(0, 0, 0, 0.45)"}}>
                            {item.readTime ? `已读时间：${item.readTime}` : null}
                        </span>
                    </Skeleton>
                </List.Item>
            )}
        />
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
                    {/*<Menu.Item key="full" onClick={this.screenFull}*/}
                    {/*           hidden={responsive.data.isMobile}>*/}
                    {/*    <Icon type={this.state.isFullscreen ? "fullscreen-exit" : "fullscreen"} style={{fontSize: 15}}*/}
                    {/*          onClick={this.screenFull}/>*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="1" onClick={this.openTodoListDraw}>
                        <Badge count={this.state.unReadTodoListCount} overflowCount={10} style={{marginLeft: 10}}>
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
                        {/*<MenuItemGroup title="设置中心">*/}
                        {/*    <Menu.Item key="setting:3">个人设置</Menu.Item>*/}
                        {/*    <Menu.Item key="setting:4">系统设置</Menu.Item>*/}
                        {/*</MenuItemGroup>*/}
                    </SubMenu>
                </Menu>
                <Drawer
                    title="待办事项"
                    width={520}
                    // closable={false}
                    onClose={this.onTodoListClose}
                    visible={this.state.todoListVisible}
                    destroyOnClose
                >
                    <Tabs
                        tabBarExtraContent={<Button shape="circle" icon="reload" type="primary"
                                                    loading={this.state.todoListLoading} onClick={this.refresh}/>}
                        activeKey={this.state.tabActiveKey}
                        onChange={this.onTabChange}>
                        <TabPane tab={<Badge count={this.state.unReadTodoListCount}
                                             overflowCount={10}
                                             style={{right: "-15px"}}>未读</Badge>}
                                 key="false">
                            {todoList}
                        </TabPane>
                        <TabPane tab="已读" key="true">
                            {todoList}
                        </TabPane>
                    </Tabs>
                    <Drawer
                        title={<div>
                            <span>详细</span>
                            <Button type="primary" className="pull-right" onClick={this.readTodo}>标为已读</Button>
                        </div>}
                        width={520}
                        // closable={false}
                        onClose={this.onChildrenDrawerClose}
                        visible={this.state.childrenDrawer}
                        destroyOnClose
                    >
                        {this.state.currentItemType == 1 ?
                            <FeedbackDetailDialog
                                id={this.state.currentItemId}
                                visible={this.state.childrenDrawer}
                                needRedirect
                                afterRedirect={this.onTodoListClose}
                            />
                            : null}
                        {this.state.currentItemType == 2 ?
                            <CashOrderDetailDialog
                                id={this.state.currentItemId}
                                visible={this.state.childrenDrawer}
                                needRedirect
                                afterRedirect={this.onTodoListClose}
                            />
                            : null}
                    </Drawer>
                </Drawer>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
                <style>{`
                    .ant-drawer-content-wrapper {
                        max-width: 100%;
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
