import React from 'react';
import {Icon} from 'antd';

export default ({type, text}) => (
    <span style={{fontSize: 12}}>
    <Icon type={type} style={{marginRight: 5}} />
        {text}
  </span>
);