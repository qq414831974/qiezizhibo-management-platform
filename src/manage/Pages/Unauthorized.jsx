/**
 * Created by wufan on 2018/12/7.
 */
import React from 'react';
import img from '../../style/imgs/401.png';
import DocumentTitle from 'react-document-title';

class Unauthorized extends React.Component {
    state = {
        animated: ''
    };
    enter = () => {
        this.setState({animated: 'hinge'})
    };

    render() {
        return (
            <DocumentTitle title="401">
                <div className="center" style={{height: '100%', background: '#ececec', overflow: 'hidden'}}>
                    <img src={img} alt="401" className={`animated swing ${this.state.animated}`}
                         onMouseEnter={this.enter}/>
                </div>
            </DocumentTitle>
        )
    }
}

export default Unauthorized;