/**
 * Created by wufan on 2018/12/25.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import {getLiveQuality} from "../../axios";
import {message} from "antd";

class LiveQualityEchartsViews extends React.Component {
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
        getLiveQuality(this.props.id).then((res) => {
            if (res && res.code == 200) {
                this.setState({
                    FPSValue: this.getFPSValue(res.data),
                    metaFPSValue: this.getMetaFPSValue(res.data),
                    bitrateValue: this.getBitRateValue(res.data),
                    metaBitrateValue: this.getMetaBitRateValue(res.data),
                    key: this.getKey(res.data),
                    loading: false,
                });
            } else {
                message.error('获取直播质量数据失败：' + (res ? (res.code + ":" + res.message) : res), 3);
            }
        });
    }
    getKey = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v.time);
        })
        return value;
    }
    getFPSValue = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v.videoFps);
        })
        return value;
    }
    getMetaFPSValue = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v.mateFps);
        })
        return value;
    }
    getBitRateValue = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v.videoRate);
        })
        return value;
    }
    getMetaBitRateValue = (data) => {
        const value = [];
        Object.values(data).forEach(v => {
            value.push(v.metaVideoRate * 1000);
        })
        return value;
    }

    render() {
        const FPSOption = {
            title: {
                text: '直播推流帧数',
                left: '50%',
                show: true,
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
                name: '标准帧数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: this.state.metaFPSValue,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(127,255,170,0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(127,255,170,0.5)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(60,179,113,0.5)'
                    }
                },
                lineStyle: {

                    normal: {
                        width: 3
                    }
                }
            }, {
                name: '帧数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: this.state.FPSValue,
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
            }
            ]
        };
        const bitrateOption = {
            title: {
                text: '直播推流码率',
                left: '50%',
                show: true,
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
                name: '最高码率',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                symbolSize: 6,
                data: this.state.metaBitrateValue,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(127,255,170,0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(127,255,170,0.5)'
                        }], false)
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(60,179,113,0.5)'
                    }
                },
                lineStyle: {

                    normal: {
                        width: 3
                    }
                }
            },
                {
                    name: '码率',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: this.state.bitrateValue,
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
                }
            ]
        };
        return this.state.loading ? null : <div className="mt-l">
            <ReactEcharts
                option={bitrateOption}
                style={{height: '350px', width: '100%'}}
                className={'react_for_echarts'}
            />
            <ReactEcharts
                option={FPSOption}
                style={{height: '350px', width: '100%'}}
                className={'react_for_echarts'}
            />
        </div>
    }
}

export default LiveQualityEchartsViews;