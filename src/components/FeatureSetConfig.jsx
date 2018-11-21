// 纯数据展现情况列表
import React from 'react';
import ReactEcharts from 'echarts-for-react';

import { Table, Form, Select, Input, Row, Col, Button, Icon } from 'antd';
import { DatePicker, TimePicker, Radio, Switch} from 'antd';
import { Upload, Modal, message, Spin} from 'antd';

import { Link } from 'react-router';

import Immutable from 'immutable';
import Reqwest from 'reqwest';

import CFormItem from './CreateFormItem';
// 搜索查询栏form 创建新item-form 更新form
import UForm from './UpdateForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


// 依赖 config 主题生成react 组件函数
const FeatureSet = (config) => {

    let tableFeature = React.createClass({
        getInitialState: function(){
            return {
                columns: [],
                resultList: [],
                loading: false,

                updateFromShow: false,
                updateFromItem: {}
            }
        },

        componentWillMount: function(){

            this.setState({
                loading: true,
                columns: this.dealConfigColumns(config.columns)
            });
        },

        render: function() {
            const self = this;

            return  <div className="featureItem">
                        <RForm RType={config.RType} submit={self.handleRetrieve}/>
                        <CForm CType={config.CType} submit={self.handleCreate}/>
                        <UForm UType={config.UType} submit={self.handleUpdate} isShow={this.state.updateFromShow} updateItem={this.state.updateFromItem} hideForm={this.hideUpdateForm}/>
                        <Table dataSource={this.state.resultList} columns={this.state.columns} loading={this.state.loading} bordered/>
                    </div>
        },

        // 预处理配置显示中的 colums 数据 用于anted的table配置
        dealConfigColumns: function(lists){
            const self = this;

            let columns = [];

            lists.forEach((item) => {
                let column = {
                    title: item.title,
                    dataIndex: item.dataIndex,
                    key: item.dataIndex,
                    width: item.width
                }

                if( item.type === 'operate' ){
                    // 兼容单一形式与数组形式
                    let btns = Array.isArray(item.btns)?item.btns:[item.btns];

                    // 处理表单 操作 栏目以及回调函数
                    column.render = item.render || function(txt, record){
                        return <span>
                                {
                                    btns.map(function(btn,i) {
                                        return  (
                                            <span key={i}>
                                                <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}>{btn.text}</a>
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                            </span>
                                        );

                                    })
                                }
                                </span>
                    };
                }else{
                    column.render = item.render || self.renderFunc[item.type] || ((text) => (<span>{text}</span>));
                }

                if(item.sort){
                    column.sorter = item.sorter || ((a, b) => a[item.dataIndex] - b[item.dataIndex]);
                }
                columns.push(column);

            });

            return columns;

        },

        // columns 类型对应的通用痛render
        renderFunc: {
            link: (text) => (
                    <span>
                        <a href={text}>{text}</a>
                    </span>),

            image: (url) => (
                    <span>
                        <img src={url} />
                    </span>)
        },

        handleCreate: function(info){
            const self = this;
            self.setState({
                loading: true
            });

            config.Create(info, function(item){
                // 初级接口的坑
                if(!item){
                    config.initData(function(list){
                        self.setState({
                            loading: false,
                            resultList: list
                        });
                    });
                    return;
                }

                let lists = self.state.resultList;
                lists.unshift(item);

                self.setState({
                    loading: false,
                    resultList: lists
                });
            });
        },

        handleUpdate: function(info){
            const self = this;
            let result = Immutable.fromJS(self.state.resultList);

            config.Update(info, function(item){
                let resultList = result.map(function(v, i){
                    if(v.get('key') === item.key){
                        return Immutable.fromJS(item);
                    }else{
                        return v;
                    }
                });
                message.success('更新成功');

                self.setState({
                    loading: false,
                    updateFromShow: false,
                    resultList: resultList.toJS()
                });
            });
        },
        hideUpdateForm: function(){
            this.setState({
                updateFromShow: false,
                updateFromItem: {}
            });
        },

        // 搜索更新处理
        handleRetrieve: function(info){
            const self = this;
            self.setState({
                loading: true
            });

            config.Retrieve(info, function(list){
                self.setState({
                    loading: false,
                    resultList: list
                });
            });
        },

        // table 操作列回调处理
        operateCallbacks: function(item, btn){
            const self = this;

            if(btn.type){

                let resultList;
                let type = btn.type;
                let itemI = Immutable.fromJS(item);
                let result = Immutable.fromJS(self.state.resultList);

                // table 操作栏目通用设定为 更新与删除 两项
                if(type === 'update'){
                    this.setState({
                        updateFromShow: true,
                        updateFromItem: itemI.toJS()
                    });
                }else if(type === 'delete'){
                    this.setState({
                        loading: true
                    });

                    config.Delete(itemI.toJS(), function(){
                        resultList = result.filter(function(v, i){
                            if(v.get('key') !== itemI.get('key')){
                                return true;
                            }
                        });
                        message.success('删除成功');

                        self.setState({
                            loading: false,
                            resultList: resultList.toJS()
                        });
                    });
                }


            }else if(btn.callback){
                btn.callback(item);
            }
        },

        componentDidMount: function(){
            const self = this;

            config.initData(function(list){
                self.setState({
                    loading: false,
                    resultList: list
                });
            });
        }
    });

    let simpleFeature = React.createClass({
        getInitialState: function(){
            return {
                item:{},
                loading: false,

                updateFromShow: false,
                updateFromItem: {}
            }
        },

        componentWillMount: function(){
        },

        render: function() {
            const self = this;
            const itemInfo = this.state.item;

            const { getFieldDecorator } = this.props.form;
            const formItemLayout = {
                labelCol: { span: 3 },
                wrapperCol: { span: 18 },
            };

            const operate = config.operate || [];

            return  <div className="featureItem">
                        <Form horizontal className='p-relative'>
                            {
                                this.state.loading?
                                    <div className="formLayout">
                                        <Spin size="large" />
                                    </div>:
                                    ''
                            }
                            {
                                config.UType.map(function(item){
                                    item.defaultValue = itemInfo[item.name]||'';
                                    return <CFormItem key={item.name} getFieldProps={getFieldDecorator} formItemLayout={formItemLayout} item={item}/>
                                })
                            }
                        </Form>
                        {
                            operate.map(function(btn){
                                return <Button key={btn.text} type="primary" size="large" onClick={self.operateCallbacks.bind(self, btn)} style={btn.style}>{btn.text}</Button>
                            })
                        }
                    </div>
        },

        componentDidMount: function(){
            const self = this;
            self.setState({
                loading: true
            });

            config.initData(function(item){
                self.setState({
                    item: item,
                    loading: false
                });
            });
        },

        operateCallbacks: function(btn){
            const self = this;

            let itemI = Immutable.fromJS(this.props.form.getFieldsValue());

            if(btn.type === 'update'){

                const self = this;


                config.Update(itemI.toJS(), function(item){

                    message.success('更新成功');

                    self.setState({
                        item: item
                    });
                });


            }else if(btn.callback){
                btn.callback(itemI.toJS());
            }
        }
    });
    simpleFeature = Form.create()(simpleFeature);


    let graphFeature = React.createClass({
        getInitialState: function(){
            return {
                option: config.option
            }
        },

        componentWillMount: function(){
        },

        render: function() {
            const self = this;
            const itemInfo = this.state.item;

            const operate = config.operate || [];

            return  <div className="featureItem">
                        <ReactEcharts
                            option={this.state.option}
                            style={config.EchartStyle}
                            className='react_for_echarts' />
                    </div>
        },

        componentDidMount: function(){
            const self = this;
            let option = Immutable.fromJS(self.state.option).toJS();

            config.initData(function(series){
                option.series = series;
                self.setState({
                    option: option
                });
            });
        }
    });

    switch (config.type){
        case 'tableList':
            return tableFeature;
            break;

        case 'graphList':
            return graphFeature;
            break;

        case 'simpleObject':
            return simpleFeature;
            break;

        case 'complexObject':
            return complexFeature;
            break;

        default:
            return tableFeature;
            break;
    }
}


export default FeatureSet;
