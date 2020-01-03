import React from 'react';
import {Form, Icon, Input, Button, Checkbox, Avatar} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchData, receiveData} from '../../action/index';
import logo from '../../static/logo.png';
import {login, prelogin} from "../../axios/index";
import {message} from "antd/lib/index";
import moment from 'moment'
import 'moment/locale/zh-cn';
import {getUser, setToken, setUser, removeUser} from "../../utils/tools";
import DocumentTitle from 'react-document-title';

moment.locale('zh-cn');

const FormItem = Form.Item;

class Login extends React.Component {
    state = {
        loginLoading: false,
    };

    componentWillMount() {
        const {receiveData} = this.props;
        receiveData(null, 'auth');
        var meta = document.getElementsByTagName('meta');
        meta["viewport"].setAttribute('content', "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
    }

    componentWillReceiveProps(nextProps) {
        const {auth: nextAuth = {}} = nextProps;
        const {history} = this.props;
        // 判断是否登陆
        if (nextAuth.data) {
            setUser(nextAuth.data);
            if (nextAuth.data&&nextAuth.data.role&&nextAuth.data.role.roleCode=='role-e2063edfcb024e0dbc78fc592d2bcf46') {
                // history.push('/anchor');
                window.location = "https://manage.qiezizhibo.com/anchor";
            } else {
                history.push('/index');
            }
        }
    }

    handleSubmit = (e) => {
        const {receiveData} = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                login(values).then((logindata) => {
                    this.setState({loginLoading: true})
                    if (logindata && logindata.code == 200) {
                        if (values.rememberMe) {
                            setUser(logindata.data);
                        } else {
                            removeUser();
                        }
                        setToken(logindata.msg);
                        receiveData(logindata.data, 'auth');
                    } else {
                        message.error('登陆失败：' + (logindata ? logindata.code + ":" + logindata.msg : logindata), 3);
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