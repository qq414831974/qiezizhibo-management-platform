/**
 * Created by wufan on 2018/12/25.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import {getVisit} from "../../axios";
import {message} from "antd";

class EchartsViews extends React.Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        //获取近期访问量
        this.setState({
            loading: true,
        });
        getVisit().then((res) => {
            if (res && res.code == 200) {
                this.setState({
                    value: this.getValue(res.data),
                    key: this.getKey(res.data),
                    loading: false,
                });
            }else{
                message.error('获取访问数据失败：' + (res ? (res.code + ":" + res.message) : res), 3);
            }
        });
    }
    getKey = (data) => {
        const value = [];
        Object.keys(data).forEach(v => {
            value.push(v);
        })
        return value;
    }
    getValue = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v);
        })
        return value;
    }

    render() {
        const option = {
            title: {
                text: '最近7天用户访问量',
                left: '50%',
                show: false,
                textAlign: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                backgroundColor: 'rgba(255,255,255,1)',
                padding: [5, 10],
                textStyle: {
                    color: '#7588E4',
                },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            legend: {
                right: 20,
                orient: 'vertical',
            },
            xAxis: {
                type: 'category',
                data: this.state.key,
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#609ee9'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 10
                    }
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#609ee9'
                    }
                },
                axisLabel: {
                    margin: 0,
                    textStyle: {
                        fontSize: 8
                    }
                }
            },
            series: [{
                name: '访问量',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: this.state.value,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(216, 244, 247,1)'
                        }, {
                            offset: 1,
                            color: 'rgba(216, 244, 247,1)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#58c8da'
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3
                    }
                }
            }]
        };
        return this.state.loading ? null : <ReactEcharts
            option={option}
            style={{height: '350px', width: '100%'}}
            className={'react_for_echarts'}
        />
    }
}

export default EchartsViews;