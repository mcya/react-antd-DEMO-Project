const contextPath = process.env.CONTEXT_PATH || '';
module.exports = () => {
  return {
    'primary-color': '#5992d8',
    'icon-url': `'${contextPath}/iconfont/iconfont'`,
    'font-size-base': '14px',
    'border-radius-base': '0',
    'border-radius-sm': '0',
    'form-item-margin-bottom': '12px',
    'table-head-background-color': '#5993D8'
  };
};
