import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {Card} from 'antd';
import MatchList from "../components/MatchList";

class MatchManagement extends React.Component {
    render() {
        return (
            <div className="gutter-box">
                <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}>
                    <MatchList />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(MatchManagement));