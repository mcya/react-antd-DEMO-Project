import React from 'react';
import { Spin } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

module.exports = function(component) {
    const Loader = React.createClass({
        getInitialState:function() {
            return {
                instance:null
            };
        },
        componentDidMount:function() {
            component(function(instance) {
                this.setState({
                    instance:instance
                });
            }.bind(this));
        },
        render:function() {
            if(this.state.instance) {
                var Instance = this.state.instance;
                return <Instance {...this.props} />;
            }else {
                return (
                  <Spin tip="正在打开..." size="large">
                    <div style={{width: '100%',height: '400px',textAlign: 'center'}}>
                    </div>
                  </Spin>
                );
            }
        }
    });

    return Loader;
};
