import React, {Component} from 'react';
import {Layout} from 'antd';
import './style/index.less';
import {receiveData} from './action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./components/Content";
import {getUser} from './utils/tools';
document.domain = "manage.qiezizhibo.com";
class App extends Component {


    componentWillMount() {
        const {receiveData} = this.props;
        const user = getUser();
        user && receiveData(user, 'auth');
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }

    componentDidMount() {

    }

    getClientWidth = () => {
        const {receiveData} = this.props;
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        receiveData({isMobile: clientWidth <= 992, clientWidth: clientWidth, clientHeight: clientHeight}, 'responsive');
    };


    render() {
        const {auth} = this.props;
        return (
            <DocumentTitle title="茄子TV后台管理系统">
                <Layout>
                    <Header user={auth.data || {}} />
                    <Content />
                    <Footer />
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
