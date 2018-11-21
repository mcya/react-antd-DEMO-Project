import React from 'react';
import { Row, Col, Table, Icon, Pagination, Select, Tag, Dropdown, Button, Modal } from 'antd';
import { MsgBox } from 'MsgBox'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as action from '../action'
import styles from './index.css';
import { Spin } from 'antd';
import FullPagePanel from 'FullPagePanel'
import ModifyInfo from './modal/dictitem/company/modifyInfo.js';
import ModifyInfoGroup from './modal/dictitem/group/modifyInfogroup.js';
import ModifyInfoProject from './modal/dictitem/project/modifyInfoproject.js';
import ModifyInfoProdtype from './modal/prodtype/modifyInfoprodtype.js';
import ModifyInfoZnjsf from './modal/znjsf/modifyInfoznjsf.js';
import ModifyInfoDlhtset from './modal/dlhtset/modifyInfodlhtset.js';
import ModifyInfoAgencyrule from './modal/agencyrule/modifyInfoagencyrule.js';
import ModifyInfoPdaquerysetting from './modal/pdaquerysetting/modifyInfopdaquerysetting.js';
import ModifyInfoSysProject from './modal/sysparam/project/modifyInfosysproject.js';
import ModifyInfoSysCompany from './modal/sysparam/company/modifyInfosyscompany.js';
import ModifyInfoSysGroup from './modal/sysparam/group/modifyInfosysgroup.js';
import ModifyInfoMoneyoption from './modal/moneyoption/modifyInfomoneyoption.js';
import ModifyInfoDsfeeset from './modal/dsfeeset/modifyInfodsfeeset.js';
import ModifyInfoYlzd from './modal/ylzd/modifyInfoylzd.js';
import ModifyInfoVatset from './modal/vatset/modifyInfovatset.js';
import ModifyInfoSaleprocset from './modal/saleprocset/modifyInfosaleprocset.js';
import ModifyInfoHkaddress from './modal/hkaddress/modifyInfohkaddress.js';
import ModifyInfoChooseroom from './modal/chooseroom/modifyInfochooseroom.js';
import ModifyInfoYearrate from './modal/yearrate/modifyInfoyearrate.js';
import ModifyInfoSaleservprocset from './modal/saleservprocset/modifyInfosaleservprocset.js';
import ModifyInfoAreabcfaset from './modal/areabcfaset/modifyInfoareabcfaset.js';
import ModifyInfoPropertydateset from './modal/propertydateset/modifyInfopropertydateset.js';
import ModifyInfoTddksz from './modal/tddksz/modifyInfoTddksz.js';

const FullTabItem = FullPagePanel.TabItem;
const columns = [
{
		title: '参数名称',
		dataIndex: 'paramname',
		width: '50%'
	}, {
		title: '参数菜单',
		dataIndex: 'parammenu',
		width: '50%'
	}];

	class TableFormMain extends React.Component {
  constructor() {
    super();
    this.state = {
			columns: columns,
			ModifyInfoProdtypeVisible: false,
			ModifyInfoVisible: false,
			ModifyInfoGroupVisible: false,
			ModifyInfoProjectVisible: false,
			ModifyInfoZnjsfVisible: false,
			ModifyInfoDlhtsetVisible: false,
			ModifyInfoAgencyruleVisible: false,
			ModifyInfoPdaquerysettingVisible: false,
			ModifyInfoSysProjectVisible: false,
			ModifyInfoSysCompanyVisible: false,
			ModifyInfoSysGroupVisible: false,
			ModifyInfoMoneyoptionVisible: false,
			ModifyInfoDsfeesetVisible: false,
			ModifyInfoYlzdVisible: false,
			ModifyInfoSaleprocsetVisible: false,
			ModifyInfoHkaddressVisible: false,
			ModifyInfoChooseroomVisible: false,
			ModifyInfoYearrateVisible: false,
			ModifyInfoSaleservprocsetVisible: false,
			ModifyInfoAreabcfasetVisible: false,
			ModifyInfoPropertydatesetVisible: false,
			ModifyInfoVatsetVisible: false,
			ModifyInfoTddkszVisible: false,
      loading: true
    }
  }

	componentDidMount() {
			this.props.queryparamrecord();
		}

		//双击表格行事件
		tableDoubleClick(record, index) {
			//console.log(record.parammenu=="土地抵扣设置（项目级）");
			if (record.parammenu === '公司级字典参数设置') {
				this.setState({ ModifyInfoVisible: true });
			} else if (record.parammenu === '产品类型（项目级）') {
				this.setState({ ModifyInfoProdtypeVisible: true });
			} else if (record.parammenu === '集团级字典参数设置') {
				this.setState({ ModifyInfoGroupVisible: true });
			} else if (record.parammenu === '项目级字典参数设置') {
				this.setState({ ModifyInfoProjectVisible: true });
			} else if (record.parammenu === '滞纳金计算设置（项目级）') {
				this.setState({ ModifyInfoZnjsfVisible: true });
			} else if (record.parammenu === '代理合同规则（项目级）') {
				this.setState({ ModifyInfoDlhtsetVisible: true });
			} else if (record.parammenu === '经纪人业绩（项目级）') {
				this.setState({ ModifyInfoAgencyruleVisible: true });
			} else if (record.parammenu === 'PDA服务设置（项目级）') {
				this.setState({ ModifyInfoPdaquerysettingVisible: true });
			} else if (record.parammenu === '项目级系统参数设置') {
				this.setState({ ModifyInfoSysProjectVisible: true });
			} else if (record.parammenu === '公司级系统参数设置') {
				this.setState({ ModifyInfoSysCompanyVisible: true });
			} else if (record.parammenu === '集团级系统参数设置') {
				this.setState({ ModifyInfoSysGroupVisible: true });
			} else if (record.parammenu === '字典参数设置') {
				this.setState({ ModifyInfoMoneyoptionVisible: true });
			} else if (record.parammenu === '代收费用设置（项目级）') {
				this.setState({ ModifyInfoDsfeesetVisible: true });
			} else if (record.parammenu === '预留字段定义（集团级）') {
				this.setState({ ModifyInfoYlzdVisible: true });
			} else if (record.parammenu === '销售过程设置（公司级）') {
				this.setState({ ModifyInfoSaleprocsetVisible: true });
			} else if (record.parammenu === '户口地址选项（集团级）') {
				this.setState({ ModifyInfoHkaddressVisible: true });
			} else if (record.parammenu === '选房设置（项目级）') {
				this.setState({ ModifyInfoChooseroomVisible: true });
			} else if (record.parammenu === '按揭年利率（项目级）') {
				this.setState({ ModifyInfoYearrateVisible: true });
			} else if (record.parammenu === '售后服务设置（项目级）') {
				this.setState({ ModifyInfoSaleservprocsetVisible: true });
			} else if (record.parammenu === '补差方案设置（公司级）') {
				this.setState({ ModifyInfoAreabcfasetVisible: true });
			} else if (record.parammenu === '房产证到期日期设置（项目级）') {
				this.setState({ ModifyInfoPropertydatesetVisible: true });
			} else if (record.parammenu === '增值税税率设置（项目级）') {
				this.setState({ ModifyInfoVatsetVisible: true });
			} else if (record.parammenu === '土地抵扣设置（项目级）') {
				this.setState({ ModifyInfoTddkszVisible: true });
			}
			this.setState({
				visible: true
			});
}
		//关闭事件
		modalClose() {
			this.setState({
				ModifyInfoVisible: false
			});
		}
		modalClose1() {
			this.setState({
				ModifyInfoZnjsfVisible: false
			});
		}
		modalClose2() {
			this.setState({
				ModifyInfoDlhtsetVisible: false
			});
		}
		modalClose3() {
			this.setState({
				ModifyInfoAgencyruleVisible: false
			});
		}
		modalClose4() {
			this.setState({
				ModifyInfoPdaquerysettingVisible: false
			});
		}
		modalClose5() {
			this.setState({
				ModifyInfoSysProjectVisible: false
			});
		}
		modalClose6() {
			this.setState({
				ModifyInfoSysCompanyVisible: false
			});
		}
		modalClose7() {
			this.setState({
				ModifyInfoSysGroupVisible: false
			});
		}
		modalClose8() {
			this.setState({
				ModifyInfoMoneyoptionVisible: false
			});
		}
		modalClose9() {
			this.setState({
				ModifyInfoGroupVisible: false
			});
		}
		modalClose10() {
			this.setState({
				ModifyInfoProjectVisible: false
			});
		}
		modalClose11() {
			this.setState({
				ModifyInfoProdtypeVisible: false
			});
		}
		modalClose12() {
			this.setState({
				ModifyInfoDsfeesetVisible: false
			});
		}
		modalClose13() {
			this.setState({
				ModifyInfoYlzdVisible: false
			});
		}
		modalClose14() {
			this.setState({
				ModifyInfoSaleprocsetVisible: false
			});
		}
		modalClose15() {
			this.setState({
				ModifyInfoHkaddressVisible: false
			});
		}
		modalClose16() {
			this.setState({
				ModifyInfoChooseroomVisible: false
			});
		}
		modalClose17() {
			this.setState({
				ModifyInfoYearrateVisible: false
			});
		}
		modalClose18() {
			this.setState({
				ModifyInfoSaleservprocsetVisible: false
			});
		}
		modalClose19() {
			this.setState({
				ModifyInfoAreabcfasetVisible: false
			});
		}
		modalClose20() {
			this.setState({
				ModifyInfoPropertydatesetVisible: false
			});
		}
		modalClose21() {
			this.setState({
				ModifyInfoVatsetVisible: false
			});
		}
		modalClose22() {
			this.setState({
				ModifyInfoTddkszVisible: false
			});
		}
    render() {
			return (
				<div>
        <Table
					size = "middle"
          columns={columns}
					onRowDoubleClick={::this.tableDoubleClick}
					dataSource={this.props.paramData}
					/>
				{/*<Modal onCancel= {::this.modalClose} visible={this.state.ModifyInfoVisible}>
						11111
				</Modal>
				<Modal onCancel= {::this.modalClose1} visible={this.state.ModifyInfoZnjsfVisible}>
						22222
				</Modal>*/}
				<ModifyInfo modalClose={this.modalClose.bind(this)} visible={this.state.ModifyInfoVisible} />
				<ModifyInfoProdtype modalClose={this.modalClose11.bind(this)} visible={this.state.ModifyInfoProdtypeVisible} />
				<ModifyInfoGroup modalClose={this.modalClose9.bind(this)} visible={this.state.ModifyInfoGroupVisible} />
				<ModifyInfoProject modalClose={this.modalClose10.bind(this)} visible={this.state.ModifyInfoProjectVisible} />
				<ModifyInfoZnjsf modalClose={this.modalClose1.bind(this)} visible={this.state.ModifyInfoZnjsfVisible} />
				<ModifyInfoDlhtset modalClose2={::this.modalClose2} visible={this.state.ModifyInfoDlhtsetVisible} />
				<ModifyInfoAgencyrule modalClose={this.modalClose3.bind(this)} visible={this.state.ModifyInfoAgencyruleVisible} />
				<ModifyInfoPdaquerysetting modalClose={this.modalClose4.bind(this)} visible={this.state.ModifyInfoPdaquerysettingVisible} />
				<ModifyInfoSysProject modalClose={this.modalClose5.bind(this)} visible={this.state.ModifyInfoSysProjectVisible} />
				<ModifyInfoSysCompany modalClose={this.modalClose6.bind(this)} visible={this.state.ModifyInfoSysCompanyVisible} />
				<ModifyInfoSysGroup modalClose={this.modalClose7.bind(this)} visible={this.state.ModifyInfoSysGroupVisible} />
				<ModifyInfoMoneyoption modalClose={this.modalClose8.bind(this)} visible={this.state.ModifyInfoMoneyoptionVisible} />
				<ModifyInfoDsfeeset modalClose={this.modalClose12.bind(this)} visible={this.state.ModifyInfoDsfeesetVisible} />
				<ModifyInfoYlzd modalClose={this.modalClose13.bind(this)} visible={this.state.ModifyInfoYlzdVisible} />
				<ModifyInfoSaleprocset modalClose={this.modalClose14.bind(this)}  visible={this.state.ModifyInfoSaleprocsetVisible} />
				<ModifyInfoHkaddress modalClose={this.modalClose15.bind(this)} visible={this.state.ModifyInfoHkaddressVisible} />
				<ModifyInfoChooseroom modalClose={this.modalClose16.bind(this)} visible={this.state.ModifyInfoChooseroomVisible} />
				<ModifyInfoYearrate modalClose={this.modalClose17.bind(this)} visible={this.state.ModifyInfoYearrateVisible} />
				<ModifyInfoSaleservprocset modalClose={this.modalClose18.bind(this)} visible={this.state.ModifyInfoSaleservprocsetVisible} />
				<ModifyInfoAreabcfaset modalClose={this.modalClose19.bind(this)} visible={this.state.ModifyInfoAreabcfasetVisible} />
				<ModifyInfoPropertydateset modalClose={this.modalClose20.bind(this)} visible={this.state.ModifyInfoPropertydatesetVisible} />
				<ModifyInfoVatset modalClose={this.modalClose21.bind(this)} visible={this.state.ModifyInfoVatsetVisible} />
				<ModifyInfoTddksz modalClose={this.modalClose22.bind(this)} visible={this.state.ModifyInfoTddkszVisible} />
	</div>
			)
    }
}



function mapStateToProps(state, ownProps) {
	return {
		loading: state.getIn(['projectPre', 'businessPar', 'loading']),
		paramData: state.getIn(['projectPre', 'businessParam', 'paramResult']).data
	}
}

function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(action, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TableFormMain)
