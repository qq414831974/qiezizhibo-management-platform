import React from 'react';
import {Form, Icon, Input, Button, Checkbox, Avatar} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchData, receiveData} from '../../action/index';
import logo from '../../static/logo.png';
import {login, getAuthUserDetail, getUserInfo} from "../../axios/index";
import {message} from "antd/lib/index";
import moment from 'moment'
import 'moment/locale/zh-cn';
import {getUser, setToken, setUser, setRole, getRole, removeToken, removeUser, removeRole} from "../../utils/tools";
import DocumentTitle from 'react-document-title';

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
            if (item.authority == "role-e2063edfcb024e0dbc78fc592d2bcf46") {
                isAnchor = true;
            }
        });
        if (roles && isAnchor) {
            window.location = "https://manage.qiezizhibo.com/anchor/";
        } else {
            history.push('/index');
        }
    }

    getUserInfo = (remember) => {
        getAuthUserDetail().then(userAuth => {
            if (userAuth && userAuth.code == 200 && userAuth.data.user) {
                const authData = userAuth.data.user;
                getUserInfo({id: authData.username, type: "userName"}).then(userData => {
                    if (userData && userData.code == 200) {
                        setUser({rememberMe: remember, ...userData.data})
                        setRole(userAuth.data.authorities)
                        this.toHome();
                    } else {
                        message.error('获取用户信息失败：' + (userData ? userData.code + ":" + userData.message : userData), 3);
                    }
                })
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
                        this.getUserInfo(values.rememberMe);
                    } else {
                        message.error('登陆失败：' + (logindata ? logindata.code + ":" + logindata.message : logindata), 3);
                    }
                    this.setState({loginLoading: false})
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const user = getUser();
        return (
            <DocumentTitle title="全国青少年校园足球赛事后台管理登陆">
                <div className="login">
                    <div className="login-form">
                        <div className="login-logo">
                            <Avatar src={logo} size="large"/>
                        </div>
                        <div className="login-logo">
                            <span>全国青少年校园足球</span>
                        </div>
                        <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                    initialValue: user ? user.userName : null,
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('passWord', {
                                    rules: [{required: true, message: '请输入密码!'}],
                                    initialValue: user ? user.passWord : null,
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
                                <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                                <Button type="primary" htmlType="submit" className="login-form-button"
                                        loading={this.state.loginLoading}
                                        style={{width: '100%'}}>
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
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