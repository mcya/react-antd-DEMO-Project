import React from 'react'
import ReactDOM from 'react-dom';
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import 'rc-menu/assets/index.css';
import SysIcon from 'SysIcon'
import Style from './index.less'

class MainPanel extends React.Component {

  state = {
    current: '1'
  }

  handleHelpSwitch(e) {
    this.setState({
      current: e.key
    })
  }

  handleCancelHelpDoc() {
    this.setState({
      helpVisible: false
    });
  }

  render() {
    return (
      <div className={Style.row}>
        <div>
          <Menu
            onClick={::this.handleHelpSwitch}
            defaultSelectedKeys={['1']}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <MenuItem key="1" ><SysIcon type="loudong" style={{ fontSize: 18 }} /><span>开发要点</span></MenuItem>
            <MenuItem key="2" ><SysIcon type="loudong" style={{ fontSize: 20 }} /><span>销售系统图标</span></MenuItem>
          </Menu>
        </div>
        <div style={{ minHeight: 500, paddingLeft: 15 }}>
          <article
            ref="helpArticle"
            className="markdown github"
            dangerouslySetInnerHTML={{ __html: require('../README.md') }}
            style={{ display: this.state.current === '1' ? 'block' : 'none' }}
          >
          </article>
          <article className="markdown github" style={{ display: this.state.current === '2' ? 'block' : 'none' }}>
            <section>
              <h2>使用方式：</h2>
              <h5>导入系统图标: import SysIcon from 'SysIcon'</h5>
              <h6>指定使用哪个图标，根据aiicon-xxx，取xxx作为type；如下：</h6>
              <h6>&lt;SysIcon type="loudong" /&gt; ==&gt; <SysIcon type="loudong" style={{ fontSize: 42 }} /></h6>
              <h2>系统图标清单</h2>
              <iframe src="../iconfont/sysicon/demo_fontclass.html" frameBorder="0" width="100%" height="3800"></iframe>
            </section>
          </article>
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  <MainPanel />,
  document.getElementById('root')
);
