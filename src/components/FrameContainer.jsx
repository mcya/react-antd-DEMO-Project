import React from 'react';
import LeftMenuData from '../constants/leftMenu'

export default class extends React.Component {

  componentDidMount() {
    const iframe = this.refs.iframe;
    if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.autoHeight(iframe);
        });
    } else {
      iframe.addEventListener('load', () => {
        this.autoHeight(iframe);
      });
    }
    // iframe.contentWindow.document.body.style.overflowY = 'auto';
  }

  autoHeight(iframe) {
    iframe.style.height = Math.max(iframe.contentWindow.document.body.scrollHeight + 1,
      iframe.contentWindow.document.documentElement.scrollHeight + 1, 200) + "px";
  }

  render() {
    const subPath = this.props.params.subPath;
    const path = this.props.location.pathname.split('/').slice(1) || [];
    let currentParts = LeftMenuData;
    let externalUrl = '#404';
    let context = __CONTEXT__;
    path.forEach((part) => {
      const cpo = currentParts.find((item) => item.key === part);
      if (!cpo) {
        return false;
      }
      externalUrl = cpo.externalUrl;
      currentParts = cpo.children || [];
      context = !!cpo.externalContext ? cpo.externalContext : context;
      return true;
    });
    if (context) {
      externalUrl = context + externalUrl;
    }
    const defaultHeight = document.body.clientHeight + 1;
    return <iframe src={externalUrl} ref="iframe" frameBorder="0" style={{ width: '100%', height: defaultHeight }} />
  }
}
