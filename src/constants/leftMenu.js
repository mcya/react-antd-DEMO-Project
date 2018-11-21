module.exports = [{
  key: 'home',
  name: '我的工作台',
  className: 'menu1',
  icon: 'home',
  hidden: true,
  url: '/',
  num: ''
}, {
  key: 'workBench',
  name: '我的工作台',
  className: 'menu1',
  expand: false,
  url: '/workBench',
  children: [
    {
      key: 'searchResult',
      name: '搜索结果',
      url: '/workBench/searchResult',
      children: [
        {
          key: 'roomInfo',
          name: '房间信息',
          url: '/workBench/searchResult/roomInfo',
          children: [
            {
              key: 'orderInfo',
              name: '订单信息',
              url: '/workBench/searchResult/roomInfo/orderInfo'
            }
          ]
        }, {
          key: 'orderInfo',
          name: '订单信息',
          url: '/workBench/searchResult/orderInfo',
          children: [
            {
              key: 'roomInfo',
              name: '房间信息',
              url: '/workBench/searchResult/orderInfo/roomInfo'
            }, {
              key: 'contractInfo',
              name: '合同信息',
              url: '/workBench/searchResult/orderInfo/contractInfo',
              children: [
                {
                  key: 'roomInfo',
                  name: '房间信息',
                  url: '/workBench/searchResult/orderInfo/contractInfo/roomInfo'
                }
              ]
            }
          ]
        }, {
          key: 'feeList',
          name: '供款列表',
          url: '/workBench/searchResult/feeList'
        }, {
          key: 'bill',
          name: '首次收款',
          url: '/workBench/searchResult/bill'
        }, {
          key: 'contractInfo',
          name: '合同信息',
          url: '/workBench/searchResult/contractInfo'
        }
      ]
    }, {
      key: 'bill',
      name: '首次收款',
      url: '/workBench/bill'
    }
  ]
}, {
    key: 'projectPre',
    name: '项目准备',
    className: 'menu2',
    icon: 'tag-o',
    url: '/projectPre',
    num: '',
    dot: false,
    children: [{
      key: 'projectMgr',
      name: '项目管理',
      url: '/projectPre/projectMgr',
      num: '',
      dot: false
    },
    {
      key: 'roomMgr',
      name: '房间管理',
      url: '/projectPre/roomMgr',
      num: '',
      dot: false
    },
    {
      key: 'house',
      name: '房源生成',
      url: '/projectPre/house',
      num: '',
      dot: false
    },
    {
      key: 'priceMgr',
      name: '价格管理',
      url: '/projectPre/priceMgr',
      num: '',
      dot: false
    },
    {
    key: 'discount',
    name: '折扣管理',
    url: '/projectPre/discount',
    num: '',
    dot: false
  },
  {
    key: 'payment',
    name: '付款方式定义',
    url: '/projectPre/payment',
    num: '',
    dot: false
  }, {
    key: 'businessParam',
    name: '业务参数',
    url: 'projectPre/businessParam',
    num: '',
    dot: false
  }]
},
{
  key: 'saleMgr',
  name: '交易管理',
  className: 'menu4',
  icon: 'tag-o',
  url: '/saleMgr',
  num: '',
  dot: false,
  children: [{
    key: 'houseQuery',
    name: '房源查询',
    num: '',
    url: '/saleMgr/houseQuery',
    dot: false
  }, {
    key: 'confessInfo',
    name: '认筹单列表',
    num: '',
    url: '/saleMgr/confessInfo',
    dot: false
  }, {
    key: 'tradeList',
    name: '交易单列表',
    url: '/saleMgr/tradeList',
    num: '',
    dot: false
  }, {
    key: 'changeLog',
    name: '变更日志',
    url: '/saleMgr/changeLog',
    num: '',
    dot: false
  }, {
    key: 'repurchase',
    name: '挞定再购',
    url: '/saleMgr/repurchase',
    num: '',
    dot: false
  }, {
    key: 'mortManage',
    name: '抵押管理',
    url: '/saleMgr/mortManage',
    num: '',
    dot: false
  }, {
    key: 'customerAcc',
    name: '客户台账',
    url: '/saleMgr/customerAcc',
    num: '',
    dot: false
  }]
}, {
  key: 'afterSer',
  name: '售后服务',
  className: 'menu5',
  icon: 'team',
  url: '/afterSer',
  num: '',
  dot: false,
  children: [
    {
      key: 'pushSign',
      name: '签约管理',
      url: '/afterSer/pushSign',
      num: '',
      dot: false
    },
    {
      key: 'contractRegSer',
      name: '合同服务',
      url: '/afterSer/contractSer',
      num: '',
      dot: false
    },
    {
      key: 'contractClaim',
      name: '合同领取',
      url: '/afterSer/contractClaim',
      num: '',
      dot: false
    },
    {
      key: 'loansSer',
      name: '贷款服务',
      url: '/afterSer/loansSer',
      num: '',
      dot: false
    },
    {
      key: 'andreminders',
      name: '催款管理',
      url: '/afterSer/andreminders',
      num: '',
      dot: false
    },
    {
      key: 'occupationSer',
      name: '入伙服务',
      url: '/afterSer/occupationSer',
      num: '',
      dot: false
    },
    {
      key: 'propertySer',
      name: '产权服务',
      url: '/afterSer/propertySer',
      num: '',
      dot: false
    },
    {
    key: 'serOverview',
    name: '服务概况',
    url: '/afterSer/serOverview',
    num: '',
    dot: false
    },
    {
      key: 'areaCompensate',
      name: '面积补差',
      url: '/afterSer/areaCompensate',
      num: '',
      dot: false
    }
]
},
{
  key: 'finance',
  name: '财务管理',
  className: 'menu7',
  url: '/finance',
  num: '',
  dot: false,
  children: [{
    key: 'invoice',
    name: '票据管理',
    url: '/finance/invoice',
    num: '',
    dot: false
  },
  {
    key: 'crmt',
    name: '收支管理',
    url: '/finance/crmt',
    num: '',
    dot: false,
    children: [{
      key: 'feeList',
      name: '供款列表',
      url: '/finance/crmt/feeList',
      num: '',
      dot: false
    }]
  },
  {
    key: 'agencyFund',
    name: '代收费用管理',
    url: '/finance/agencyFund',
    num: '',
    dot: false
  },
  {
    key: 'interface',
    name: '财务接口设置',
    url: '/finance/interface',
    num: '',
    dot: false,
    children: [{
      key: 'docRuleIn',
      name: '财务接口设置',
      url: '/finance/interface/docRuleIn',
      num: '',
      dot: false
    }]
  }, {
    key: 'voucherMgr',
    name: '凭证管理',
    url: '/finance/voucherMgr',
    num: '',
    dot: false
  }]
}, {
  key: 'setPriceMgr',
  name: '定价管理',
  url: '/setPriceMgr',
  className: 'menu12',
  children: [
    {
      key: 'setPojectPrice',
      name: '项目定价',
      url: '/setPriceMgr/setPojectPrice',
      externalUrl: '/pricemgr/priceplan/queryPricePlan.do'
    }, {
      key: 'changePojectPrice',
      name: '项目调价',
      url: '/setPriceMgr/changePojectPrice',
      externalUrl: '/pricemgr/adjustplan/queryAdjustPlan.do'
    }, {
      key: 'roomWeightTemp',
      name: '房间权重模板',
      url: '/setPriceMgr/roomWeightTemp',
      externalUrl: '/pricemgr/priceopr/initTemplet.do'
    }, {
      key: 'parkParamTemp',
      name: '车位参数模板',
      url: '/setPriceMgr/parkParamTemp',
      externalUrl: '/pricemgr/parking/initTemplate.do'
    }, {
          key: 'areaChangeAudit',
          name: '面积变更审核',
          url: '/setPriceMgr/areaChangeAudit',
          externalUrl: '/pricemgr/areachg/initAreaChg.do'
      }
  ]
},
{
	key: 'tdprint',
	name: '套打设置',
	className: 'menu9',
	url: '/tdprint',
	num: '',
	dot: false,
	children: [{
		key: 'template',
		name: '模版设置',
		url: '/tdprint/template',
		num: '',
		dot: false
	},
  {
		key: 'receipt',
		name: '收据设置',
		url: '/tdprint/receipt',
		num: '',
		dot: false
	}]},
{
  key: 'reportForm',
  name: '报表管理',
  className: '',
  url: '/reportForm',
  num: '',
  dot: false,
  children: [{
    key: 'count',
    name: '统计报表',
    url: '/reportForm/count',
    num: '',
    dot: false
  }, {
    key: 'reportManage',
    name: '报表管理',
    url: '/reportForm/reportManage',
    num: '',
    dot: false
  }]
},
{
  key: 'veeker',
	name: '微课管理',
	className: 'menu8',
	url: '/veeker',
	num: '',
	children: [{
    key: 'veekerSet',
		name: '微课链接',
		url: '/veeker/veekerSet',
		num: '',
		dot: false
  }]
},
{
	key: 'system',
	name: '系统设置',
	className: 'menu8',
	url: '/system',
	num: '',
	dot: false,
	children: [{
		key: 'org',
		name: '组织架构',
		url: '/system/org',
		num: '',
		dot: false
	},
  {
		key: 'manage',
		name: '授权管理',
		url: '/system/manage',
		num: '',
		dot: false
	},
  {
		key: 'general',
		name: '通用岗位',
		url: '/system/general',
		num: '',
		dot: false
	},
  {
		key: 'user',
		name: '用户管理',
		url: '/system/user',
		num: '',
		dot: false
	},
  {
		key: 'sysSet',
		name: '系统设置',
		url: '/system/sysSet',
		num: '',
		dot: false
	},
  {
		key: 'log',
		name: '日志管理',
		url: '/system/log',
		num: '',
		dot: false
	},
  {
		key: 'shortMsg',
		name: '短信计划',
		url: '/system/shortMsg',
		num: '',
		dot: false
	}]
},
{
	key: 'workflow',
	name: '我的工作',
	className: 'menu10',
	url: '/workflow',
	children: [{
    key: 'mywork',
		name: '我的待办',
		url: '/workflow/mywork',
		num: '',
		dot: false
	},{
    key: 'myworked',
		name: '我的已办',
		url: '/workflow/myworked',
		num: '',
		dot: false
	},{
    key: 'myworkhi',
		name: '我发起的',
		url: '/workflow/myworkhi',
		num: '',
		dot: false
	}]
}]
