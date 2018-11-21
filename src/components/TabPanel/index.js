import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs, Icon } from 'antd'

const defaultProps = {
    tabSet: [],
    currentIndex: 0
}

const propTypes = {
    tabSet: PropTypes.array,
    currentIndex: PropTypes.number
}

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class TabPanel extends React.Component{
  constructor(props) {
      super(props)
  }

  render(){
    const { tabSet } = this.props;

    return (

    )
  }
}
