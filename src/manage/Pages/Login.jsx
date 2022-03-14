import React from 'react';
import {Form, Icon, Input, Button, Checkbox, Avatar} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchData, receiveData} from '../../action/index';
import logo from '../../static/logo.png';
import {login, getCurrentAdminUserInfo, getUserByUserNo} from "../../axios/index";
import {message} from "antd/lib/index";
import moment from 'moment'
import 'moment/locale/zh-cn';
import {getUser, setToken, setUser, setRole, getRole, removeToken, removeUser, removeRole} from "../../utils/tools";
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router-dom';

moment.locale('zh-cn');

const FormItem = Form.Item;

class Login extends React.Component {
    state = {
        loginLoading: false,
    };

    componentWillMount() {
        var meta = document.getElementsByTagName('meta');
        meta["viewport"].setAttribute('content', "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
    }

    toHome = () => {
        const {history} = this.props
        const roles = getRole();
        console.log(roles)
        let isAnchor = false;
        roles.forEach((item, index) => {
            if (item.isAnchor) {
                isAnchor = true;
            }
        });
        if (roles && isAnchor) {
            window.location = "https://manage.qiezizhibo.com/anchor/";
        } else {
            if (this.state.loginType === 'login') {
                history.push('/index');
            } else if (this.state.loginType === 'toolbox') {
                history.push('/toolbox');
            }
        }
    }

    getUserInfo = (password, remember) => {
        getCurrentAdminUserInfo().then(userAuth => {
            if (userAuth && userAuth.code == 200 && userAuth.data) {
                setUser({rememberMe: remember, ...userAuth.data, password: password})
                setRole(userAuth.data.roles)
                this.toHome();
            } else {
                message.error('获取用户信息失败：' + (userAuth ? userAuth.code + ":" + userAuth.message : userAuth), 3);
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                login(values).then((logindata) => {
                    this.setState({loginLoading: true})
                    if (logindata && logindata.code == 200) {
                        setToken(logindata.data);
                        this.getUserInfo(values.password, values.rememberMe);
                    } else {
                        message.error('登陆失败：' + (logindata ? logindata.code + ":" + logindata.message : logindata), 3);
                    }
                    this.setState({loginLoading: false})
                });
            }
        });
    };
    onForgetPassword = () => {
        alert("请联系工作人员");
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const user = getUser();
        return (
            <DocumentTitle title="茄子TV后台管理系统登陆">
                <div className="login">
                    <div className="login-form">
                        <div className="login-logo">
                            <Avatar src={logo} size="large"/>
                        </div>
                        <div className="login-logo">
                            <span>茄子直播</span>
                        </div>
                        <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                    initialValue: user ? user.userName : null,
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>}
                                           placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码!'}],
                                    initialValue: user ? user.password : null,
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                           placeholder="请输入密码"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('rememberMe', {
                                    valuePropName: 'checked',
                                    initialValue: user ? true : false,
                                })(
                                    <Checkbox>记住我</Checkbox>
                                )}
                                <span className="login-form-forgot cursor-hand" onClick={this.onForgetPassword}
                                      style={{float: 'right'}}>忘记密码</span>
                                <div>
                                    <Button type="primary" htmlType="submit" className="login-form-button"
                                            onClick={() => {
                                                this.setState({loginType: 'login'})
                                            }}
                                            loading={this.state.loginLoading}>
                                        登录
                                    </Button>
                                    <Button type="primary" htmlType="submit" className="login-form-button"
                                            onClick={() => {
                                                this.setState({loginType: 'toolbox'})
                                            }}
                                            loading={this.state.loginLoading}>
                                        登录工具箱
                                    </Button>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                    <div className="w-full center" style={{
                        position: "fixed",
                        bottom: 0,
                        padding: "10px",
                        textAlign: "center",
                        background: "#fff"
                    }}>
                        <div>©2022 茄子直播</div>
                        <a href="https://beian.miit.gov.cn/" target="_blank">
                            <span className="ml-l" style={{textDecoration: "underline"}}>闽ICP备17018408号-1</span>
                        </a>
                        <a href="https://beian.miit.gov.cn/" target="_blank">
                            <span className="ml-l" style={{textDecoration: "underline"}}>闽ICP备17018408号-2</span>
                        </a>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

const mapStateToPorps = state => {
    const {auth} = state.httpData;
    return {auth};
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));