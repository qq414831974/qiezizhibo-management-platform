import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Layout} from 'antd';
import Router from "../routes";

class Content extends Component {

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout.Content>
                <Router />
            </Layout.Content>
        );
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(Content));
