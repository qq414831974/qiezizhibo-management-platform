import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {Card} from 'antd';
import { Redirect} from 'react-router-dom';
import TimelineList from "../components/TimelineList";

class TimelineManagement extends React.Component {
    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/" />;
        }
        return (
            <div className="gutter-box">
                <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}>
                    <TimelineList matchId={this.props.match.params.id} />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(TimelineManagement));