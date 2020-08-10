import React, {Component} from 'react';
import {Layout, notification, Icon} from 'antd';
import SiderCustom from './manage/Components/SiderCustom';
import HeaderCustom from './manage/Components/HeaderCustom';
import Routes from './routes';
import {receiveData} from './action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {getUser} from './utils/tools';
import DocumentTitle from 'react-document-title';

moment.locale('zh-cn');
const {Content, Footer} = Layout;
// document.domain = "manage.qiezizhibo.com";

class App extends Component {
    state = {
        collapsed: false,
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const user = getUser();
        user && receiveData(user, 'auth');
        // receiveData({a: 213}, 'auth');
        // fetchData({funcName: 'admin', stateName: 'auth'});
        this.getClientWidth();

        window.onresize = () => {
            //console.log('屏幕变化了');
            this.getClientWidth();
            // console.log(document.body.clientWidth);
        }
    }

    componentDidMount() {
        // const openNotification = () => {
        //     notification.open({
        //         message: '欢迎',
        //         description: (
        //             <div>
        //                 <p>
        //                     message1： <a href="" target="_blank" rel="noopener noreferrer">somethings</a>
        //                 </p>
        //                 <p>
        //                     message2： <a href="" target="_blank" rel="noopener noreferrer">somethings</a>
        //                 </p>
        //             </div>
        //         ),
        //         icon: <Icon type="smile-circle" style={{color: 'red'}}/>,
        //         duration: 0,
        //     });
        //     localStorage.setItem('isFirst', JSON.stringify(true));
        // };
        // const isFirst = JSON.parse(localStorage.getItem('isFirst'));
        // !isFirst && openNotification();
        // {
        //     this.props.responsive.data.isMobile ? this.state.collapsed = false : this.state.collapsed = true
        // }
    }

    getClientWidth = () => {    // 获取当前浏览器宽度并设置responsive管理响应式
        const {receiveData} = this.props;
        const clientWidth = document.body.clientWidth;
        console.log(clientWidth);
        receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {auth, responsive} = this.props;
        return (
            <DocumentTitle title="茄子TV后台管理系统">
                <Layout>
                    <SiderCustom collapsed={this.state.collapsed} ontoggle={this.toggle}/>
                    {(responsive.data.isMobile && !this.state.collapsed)
                        ?
                        <Layout style={{flexDirection: 'column'}}>
                            <div onClick={this.toggle} className="h-full w-full"/>
                        </Layout>
                        :
                        <Layout style={{flexDirection: 'column'}}>
                            <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}}/>
                            <Content style={{margin: '0 16px', overflow: 'initial',}}
                                     hidden={responsive.data.isMobile && !this.state.collapsed ? true : false}>
                                <Routes auth={auth}/>
                            </Content>
                            <Footer style={{textAlign: 'center'}}>
                                Qiezizhibo-Admin ©2020
                            </Footer>
                        </Layout>
                    }
                    {/* {
                    responsive.data.isMobile && (   // 手机端对滚动很慢的处理
                        <style>
                        {`
                            #root{
                                height: auto;
                            }
                        `}
                        </style>
                    )
                } */}
                </Layout>
            </DocumentTitle>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
