import React, {Component} from 'react';
import {Layout, Divider} from 'antd';
import logo_horizontal from '../static/logo-horizontal.svg';

class Footer extends Component {
    render() {
        return (
            <Layout.Footer className="qz-live-footer">
                <Divider className="mt-s mb-s" />
                <div className="w-full center">
                    <span>© 2019 茄子直播, Inc.</span>
                </div>
                <div className="w-full center">
                    <img className="qz-live-footer-logo-img" src={logo_horizontal} alt="茄子TV" />
                </div>
            </Layout.Footer>
        );
    }
}

export default Footer;
