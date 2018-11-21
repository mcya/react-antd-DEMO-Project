// Learn more on how to config.
// - https://github.com/dora-js/dora-plugin-proxy#规则定义
const mockUrl = 'http://183.232.178.81:8080/mockjsdata'

const zxUrl = 'http://183.240.87.233:8081';   //zx

const lsjUrl = 'http://192.168.1.119:8080/BackGround';//lsj


const proxyUrl = zxUrl;

module.exports = {

  'GET /project/queryIsEcommerce.do': proxyUrl,
  'GET /project/queryIsEcommerce.do': proxyUrl,


  '/api/todos'(req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        data: [
          {
            id: 1,
            text: 'Learn antd',
            isComplete: true
          },
          {
            id: 2,
            text: 'Learn ant-tool'
          },
          {
            id: 3,
            text: 'Learn dora'
          }
        ]
      });
    }, 500);
  },
  '/api/login'(req, res) {
    console.log('req:', req)
    console.log('res:', res)
    setTimeout(function () {
      res.json({
        success: true,
        data: {
          user: 'admin'
        }
      });
    }, 500);
  },
  'GET /js/polyfill/ie8-polyfill.js': './static/js/polyfill/ie8-polyfill.js'
};
