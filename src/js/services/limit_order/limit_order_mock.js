import { timeout, calcInterval, getFormattedDate } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"
// import { converters.toT } from "../../utils/converter";
import * as converters from "../../utils/converter";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import { sortBy } from "underscore";
import * as exchangeActions from "../../actions/exchangeActions";
import constants from "../constants";

const MAX_REQUEST_TIMEOUT = 3000

const keyMapping = {
    "id": "id",
    "src": "source",
    "dst": "dest",
    "src_amount": "src_amount",
    "min_rate": "min_rate",
    "addr": "user_address",
    "nonce": "nonce",
    "fee": "fee",
    "receive": "receive",
    "status": "status",
    "created_at": "created_at",
    "updated_at": "updated_at",
    "msg": "msg",
}

const jsonString = `{"fields":["id","addr","nonce","src","dst","src_amount","min_rate","fee","receive","status","msg","tx_hash","created_at","updated_at"],"orders":[[15629,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d107f7e","SNT",null,15.0,0.0644,0.0046,0,"cancelled",[],null,1561362335,1561362369],[15624,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d1070fc","WETH","TUSD",0.5,368.9053,0.0045,0,"open",[],null,1561358597,1561358597],[6787,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca5b6","OMG","KNC",1.6835,7.4,0.004,0,"open","hello",null,1561109958,1561112985],[6786,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca5b4","OMG","KNC",1.6835,7.4,0.004,0,"open",[],null,1561109945,1561112985],[6785,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4cb","WETH","KNC",1.6835,368.9053,0.004,0,"open",[],null,1561109714,1561112985],[6784,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4ca","WETH","KNC",1.6835,368.9053,0.004,0,"open",[],null,1561109710,1561112985],[6783,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4bf","WETH","KNC",1.6835,368.9053,0.004,0,"cancelled",[],null,1561109698,1561112985],[5602,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c931d","KNC","WETH",532.05507,0.002605,0.004,0,"cancelled",[],null,1561105205,1561112985],[5601,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c9147","KNC","WETH",1000.0,0.002603,0.0008,0,"cancelled",[],null,1561105190,1561112985],[5600,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c90b8","KNC","WETH",1.0,0.002604,0.004,0,"cancelled",[],null,1561104592,1561112985],[5599,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c8d65","KNC","WETH",1.0,0.002603,0.0046,0,"cancelled",[],null,1561103733,1561112985],[5598,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c8cb7","WETH","KNC",0.001,368.9053,0.0046,0,"cancelled",[],null,1561103695,1561112985],[2219,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c830c","BAT","KNC",3.6694,0.1787,0.0046,0,"cancelled",[],null,1561101382,1561358944],[1405,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c780e","SNT","KNC",15.4323,0.0644,0.0046,0,"cancelled",[],null,1561098275,1561112985],[1404,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c76cb","ZIL","WETH",7.0,0.0001991,0.0046,0,"cancelled",[],null,1561097940,1561112985],[503,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6653","WETH","KNC",0.001,1.4984,0.0046,0,"cancelled",[],null,1561093727,1561112985],[502,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6148","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092435,1561112985],[501,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c613f","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092429,1561112985],[500,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6125","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092419,1561112985],[499,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6111","DAI","LINK",1.7526,244.2423,0.0046,0,"cancelled",[],null,1561092386,1561112985],[495,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c5382","WETH","KNC",0.45,368.9053,0.0046,0,"cancelled",[],null,1561088948,1561112985],[485,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11b6","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006529,1561112985],[484,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11af","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006521,1561112985],[483,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11ab","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006514,1561112985],[482,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11a6","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006509,1561112985],[481,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b10dd","DAI","KNC",3.0,0.6214,0.0045,0,"cancelled",[],null,1561006331,1561112985],[480,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b0ac2","KNC","WETH",5.0,0.002603,0.0045,0,"cancelled",[],null,1561004873,1561112985],[479,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b0a5d","KNC","WETH",5.0,0.002603,0.0045,0,"cancelled",[],null,1561004740,1561112985],[478,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b06da","KNC","WETH",2.0,0.002603,0.0045,0,"cancelled",[],null,1561004640,1561112985],[477,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b04be","KNC","WETH",2.0,0.002603,0.0045,0,"cancelled",[],null,1561003769,1561112985],[475,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a2226","ADX","WETH",2.3044,0.001085,0.0045,0,"cancelled",[],null,1560945726,1561112985],[474,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a20f2","BAT","WETH",6.1673,0.0031,0.0045,0,"cancelled",[],null,1560944902,1561112985],[473,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1f68","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944513,1561112985],[472,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1e9a","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944438,1561112985],[471,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1e91","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944285,1561112985],[470,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1a7f","KNC","WETH",2.0,0.003,0.0045,0,"cancelled",[],null,1560943413,1561112985],[469,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1975","KNC","WETH",2.0,0.0028,0.0045,0,"cancelled",[],null,1560943082,1561112985],[468,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a196a","KNC","WETH",2.0,0.0028,0.0045,0,"cancelled",[],null,1560942968,1561112985],[467,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1703","KNC","WETH",2.0,0.0027,0.0045,0,"cancelled",[],null,1560942351,1561112985],[463,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a084c","OMG","WETH",29.0864631302519,0.019928,0.004,0,"cancelled",[],null,1560938574,1561112985],[462,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a07a3","KNC","WETH",1530.05507992922,0.002604,0.0008,0,"cancelled",[],null,1560938409,1561112985],[458,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09fc7f","KNC","WETH",250.0,0.002604,0.0041,0,"cancelled",[],null,1560935560,1561112985],[455,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e142","KNC","WETH",300.0,0.0027,0.0041,0,"cancelled",[],null,1560928583,1561112985],[454,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e12f","KNC","WETH",300.0,0.0027,0.0041,0,"cancelled",[],null,1560928564,1561112985],[453,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e120","KNC","WETH",200.0,0.0027,0.0041,0,"cancelled",[],null,1560928549,1561112985],[452,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e0f9","KNC","WETH",200.0,0.0027,0.0041,0,"cancelled",[],null,1560928513,1561112985],[449,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09b6a2","KNC","BAT",3.0,5.3669,0.005,0,"cancelled",[],null,1560917793,1561112985],[448,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09b560","KNC","WETH",200.0,0.002604,0.005,0,"cancelled",[],null,1560917345,1561112985],[443,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d08ad20","WETH","DAI",1.0,594.0,0.005,0,"cancelled",[],null,1560849757,1561112985],[442,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0888a8","KNC","BAT",2.0,5.3669,0.005,0,"cancelled",[],null,1560840382,1561112985],[424,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0760ac","KNC","BAT",2.0,5.3669,0.005,0,"cancelled",[],null,1560764594,1561112985],[423,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075f19","KNC","WETH",20.0,0.002603,0.005,0,"cancelled",[],null,1560764194,1561112985],[422,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075ef9","DAI","KNC",5.6,0.6214,0.005,0,"cancelled",[],null,1560764157,1561112985],[421,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075dca","KNC","WETH",20.0,0.002603,0.005,0,"cancelled",[],null,1560763867,1561112985],[420,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075cb4","KNC","WETH",200.0,0.002603,0.005,0,"cancelled",[],null,1560763607,1561112985],[419,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07562d","WETH","KNC",0.5,370.0,0.005,0,"cancelled",[],null,1560761924,1561112985],[418,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07527e","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760972,1561112985],[417,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07524a","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760961,1561112985],[416,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075246","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760908,1561112985],[415,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075241","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760904,1561112985],[414,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07523e","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760901,1561112985],[413,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075239","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760895,1561112985],[412,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075233","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760891,1561112985],[411,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075229","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760887,1561112985],[410,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075223","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760874,1561112984],[409,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07521b","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760870,1561112985],[408,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075214","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760864,1561112985],[407,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07520d","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760853,1561112985],[406,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075139","BAT","KNC",8.6156,1.4,0.005,0,"cancelled",[],null,1560760651,1561112985],[405,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d074697","KNC","DAI",200.0,1.545748,0.005,0,"cancelled",[],null,1560757916,1561112984],[404,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0745b0","KNC","DAI",2.0,1.5457,0.005,0,"cancelled",[],null,1560757777,1561112984],[403,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d073f6e","KNC","BAT",200.0,5.3669,0.005,0,"cancelled",[],null,1560756169,1561112984],[402,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d073b63","BAT","KNC",19.461,0.1787,0.005,0,"cancelled",[],null,1560755131,1561112984],[400,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0732a0","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560752812,1561112984],[390,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d037699","WETH","KNC",5.0,368.9053,0.001,1,"filled",[],"0x74e3d692a06dff260c35cf05ab1f5b0f57033c73",1560508058,1561112984],[388,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0372d0","WETH","KNC",0.6,368.9053,0.005,0,"cancelled",[],null,1560507089,1561112984],[387,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d03707e","WETH","KNC",1.0,368.9053,0.005,0,"cancelled",[],null,1560506498,1561112984],[380,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035e27","WETH","KNC",2.1549,368.9053,0.005,0,"invalidated",[],null,1560501893,1561112984],[379,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035c2b","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501298,1561112984],[378,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035ba3","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501158,1561112984],[377,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b2c","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501054,1561112984],[376,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b22","WETH","KNC",0.495,368.9053,0.005,0,"invalidated",[],null,1560501037,1561112984],[375,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b1a","WETH","KNC",0.495,368.9053,0.005,1,"filled",[],"0x74e3d692a06dff260c35cf05ab1f5b0f57033c73",1560501027,1561112984],[368,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.97737138822154,368.9053,0.005,0,"cancelled",[],null,1560497209,1560506686],[367,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.976708140221545,368.9053,0.005,0,"cancelled",[],null,1560496209,1560496369],[366,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",7.13565757132096,373.0,0.001,0,"cancelled",[],null,1560496060,1560496060],[362,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.977812882221545,368.9053,0.005,0,"cancelled",[],null,1560494673,1560495066],[354,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","BAT","APPC",14.5694454533297,0.76814,0.005,0,"cancelled",[],"",1560413760,1560413760],[312,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","SNT","KNC",190.0,0.064407,0.005,0,"cancelled",[],null,1560325241,1560933469],[310,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","WETH",37.0864631302519,0.019928,0.005,0,"cancelled",[],null,1560325049,1560325071],[308,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","WETH",37.0864631302519,0.019928,0.005,0,"cancelled",[],null,1560324921,1560324932],[296,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.6,372.0,0.005,0,"cancelled",[],null,1560250984,1560250984],[295,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",3.0,0.0029,0.005,1,"filled",[],null,1560250897,1560250897],[290,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.0012,370.0,0.005,1,"filled",[],null,1560250316,1560250316],[289,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","OMG",1.0,0.129187,0.005,1,"filled",[],null,1560249412,1560250397],[288,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,1,"filled",[],null,1560249404,1560249404],[287,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,1,"filled",[],null,1560249281,1560249286],[286,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,0,"open",[],null,1560249263,1560249263],[285,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.0015,368.9053,0.005,0,"open",[],null,1560249233,1560506868],[270,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","KNC",1.0,7.351693,0.005,0,"open",[],null,1560243814,1560933469],[267,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.5,368.9053,0.005,0,"open",[],null,1560243135,1560243578],[266,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.0,368.9053,0.005,0,"open",[],null,1560243101,1560497179],[265,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.0,368.9053,0.005,0,"open",[],null,1560243021,1560506858]]}`

const data = filterOrder(JSON.parse(jsonString));

function filterOrder(result) {
    var orderList = []
    var fields = result.fields
    var orders = result.orders
    for (var i = 0; i < orders.length; i++) {
        var order = {}
        for (var j = 0; j < fields.length; j++) {
            var field = keyMapping[fields[j]] ? keyMapping[fields[j]] : fields[j]
            order[field] = orders[i][j]
        }
        orderList.push(order)
    }
    const results = orderList.map(item => {
        return {
            ...item,
            user_address: item.user_address.toLowerCase()
        }
    });
    return results;
}

export function getOrders() {
    return new Promise((resolve, rejected) => {
        // resolve(data);
        const results = data.map((item, index) => {
            let sideTrade = "buy"
            if (index % 2 == 0) {
                sideTrade = "sell"
            }
            return {
                ...item,
                user_address: item.user_address.toLowerCase(),
                side_trade: sideTrade
            }
        });          
        resolve(results);
        return;
    })
}

function sortOrders(orders, dateSort) {
    let results = sortBy(orders, item => {
        // return getFormattedDate(item.updated_at, true);
        return item.updated_at;
    });

    if (dateSort === "desc") {
        results.reverse();
    }

    // results = _.sortBy(results, item => {
    //     if (item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) {
    //         return 0;
    //     } else if (item.status === LIMIT_ORDER_CONFIG.status.OPEN) {
    //         return 1;
    //     } else {
    //         return 2;
    //     }
    // }, ["asc"]);

    return results;
}

export function getOrdersByFilter(address = null, pair = null, type = null, status = null, time = null, dateSort = "desc", pageIndex = 1, pageSize = LIMIT_ORDER_CONFIG.pageSize) {
    return new Promise((resolve, reject) => {
        let results = data

        // Address filter
        if (address && address.length > 0) {
            results = results.filter(item => {
                return address.indexOf(item.user_address) !== -1;
            });
        }

        // Pair filter
        if (pair && pair.length > 0) {
            results = results.filter(item => {
                const key = `${item.source}-${item.dest}`;
                const index = pair.indexOf(key);
                return index !== -1;
            });
        }

        // Status filter
        if (status && status.length > 0) {
            results = results.filter(item => {
                const index = status.indexOf(item.status);
                return index !== -1;
            });
        }

        // Type filter
        if (type && type.length > 0) {
            results = results.filter(item => {
                const index = type.indexOf(item.side_trade);
                return index !== -1;
            });
        }

        // Time filter
        if (time) {
            const interval = calcInterval(time);
            const currentTime = new Date().getTime() / 1000;

            results = results.filter(item => {
                return item.updated_at >= currentTime - interval;
            });
        }

        results = sortOrders(results, dateSort);

        const orderIndexStart = pageSize * (pageIndex - 1);

        const itemsCount = results.length;

        if (results.length < pageSize) {
            resolve({
                orders: results,
                itemsCount
            });
            return;
        } else {
            const orders = results.slice(orderIndexStart, pageIndex * pageSize);

            resolve({
                orders,
                itemsCount
            })
            return;
        }
    });
}


export function submitOrder(order) {
    return new Promise((resolve, rejected) => {
        const newOrder = { ...order };

        let sourceTokenSymbol, destTokenSymbol, sourceTokenDecimals;
        Object.keys(BLOCKCHAIN_INFO.tokens).forEach(key => {
            const token = BLOCKCHAIN_INFO.tokens[key];
            if (token.address === order.src_token) {
                sourceTokenSymbol = token.symbol;
                sourceTokenDecimals = token.decimals;
            }
            if (token.address === order.dest_token) {
                destTokenSymbol = token.symbol;
            }
        });

        newOrder.updated_at = new Date().getTime() / 1000;
        newOrder.created_at = new Date().getTime() / 1000;
        newOrder.status = "open"
        newOrder.id = Math.floor(Date.now() / 1000)
        const sourceAmount = converters.toT(order.src_amount, sourceTokenDecimals);
        newOrder.src_amount = sourceAmount === "Infinity" || sourceAmount === "NaN" ? sourceAmount : parseFloat(sourceAmount);
        newOrder.fee = converters.toT(order.fee, 4) / 100;
        newOrder.min_rate = converters.toT(order.min_rate, 18);
        newOrder.source = sourceTokenSymbol;
        newOrder.dest = destTokenSymbol;
        newOrder.receive = 100;
        newOrder.side_trade = order.side_trade
        data.push(newOrder);
        resolve(newOrder);
        return;
    })
}


export function cancelOrder(order) {
    return new Promise((resolve, reject) => {
        const target = data.filter(item => item.id === order.id);

        if (target.length > 0) {
            const newOrder = { ...target[0] };
            const index = data.indexOf(target[0]);
            newOrder.updated_at = new Date().getTime() / 1000;
            newOrder.status = "cancelled";
            data.splice(index, 1, newOrder);
            resolve(newOrder);
        } else {
            reject("No order matches");
        }

        return;
    })
}


export function getNonce(userAddr, source, dest) {
    return new Promise((resolve, rejected) => {
        resolve(1)
    })
}


export function getFee(userAddr, src, dest, src_amount, dst_amount) {
    return new Promise((resolve, rejected) => {
        resolve({
          success: true,
          fee: 0.0036,
          discount_percent: 10,
          non_discounted_fee: 0.004
        })
    })
}


export function getOrdersByIdArr(idArr) {
    return new Promise((resolve, rejected) => {
        var returnData = []
        for (var i = 0; i < idArr.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].id === idArr[i]) {
                    returnData.push(data[j])
                    break
                }
            }
        }
        const results = returnData.map(item => {
            return {
                ...item,
                user_address: item.user_address.toLowerCase()
            }
        });
        resolve(results)
    })
}

export function isEligibleAddress(addr) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

export function getUserStats() {
    return new Promise((resolve, reject) => {
        const orders = data;
        const pairs = Array.from(new Set(orders.map(item => `${item.source}-${item.dest}`)));
        const addresses = Array.from(new Set(orders.map(item => item.user_address)));

        const orderStats = {
            "open": data.filter(item => {
                return item.status === LIMIT_ORDER_CONFIG.status.OPEN
            }).length,
            "in_progress": data.filter(item => {
                return item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS
            }).length
        }

        resolve({
            pairs, addresses, orderStats
        });
    });
}

export function getPendingBalances(address) {
    return new Promise((resolve, reject) => {
        /*const balances = {};
        data.forEach(item => {
            if ((item.status === LIMIT_ORDER_CONFIG.status.OPEN || item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) && (item.user_address.toLowerCase() === address.toLowerCase())) {
                if (balances.hasOwnProperty(item.source)) {
                    balances[item.source] += item.src_amount;
                } else {
                    balances[item.source] = 0;
                }
            }
        });
        resolve(balances);*/

      const pendingBalanceResponse = {
        success: true,
        data: {
          "DAI": 3
        },
        pending_txs: [
          {
            "tx_hash": "0xcbeb1dace640a1bf857a8fce4e211806b686436e44f1d2331c7ccf3bbe6138e7",
            "src_token": "DAI",
            "src_amount": 2
          }
        ]
      };

      resolve(pendingBalanceResponse);
    });
}

export function getRelatedOrders(sourceToken, destToken, minRate, address) {
    return new Promise((resolve, reject) => {
        const result = {
            "fields": [
                "id",
                "addr",
                "nonce",
                "src",
                "dst",
                "src_amount",
                "min_rate",
                "fee",
                "receive",
                "status",
                "msg",
                "tx_hash",
                "created_at",
                "updated_at"
            ],
            "orders": [
                [
                    123456,
                    "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
                    57818117002753298411002922520048253037538608343117297513952908572797262671854,
                    "KNC",
                    "WETH",
                    "300",
                    "0.0028",
                    0.1,
                    1,
                    "open",
                    "",
                    "tx_hash",
                    1556784881,
                    1556784882
                ]
            ]
        }
        const orders = filterOrder(result);
        resolve(orders);

        return;
    });
}

export function getModeLimitOrder() {
    // const totalOrders = getCookie("order_count");
    return "client"
}

changeState();

function changeState() {
    const filters = data.filter(item => item.id === 6787);

    if (filters.length > 0) {
        const order = filters[0];
        setTimeout(() => {
            order.status = "in_progress";
            order.updated_at = new Date().getTime() / 1000;
        }, 10 * 1000);

        setTimeout(() => {
            order.status = "filled";
            order.updated_at = new Date().getTime() / 1000;
        }, 20 * 1000);
    }

}

const getvolumeAndChangeDumpData = () => {
  return `{"data":[{"pair":"ETH_WETH","change":0,"volume":248.2732196521362,"buy_price":1,"sell_price":1},{"pair":"ETH_KNC","change":1.63,"volume":40.50672527224612,"buy_price":0.0009980188586821604,"sell_price":0.000997369622381961},{"pair":"ETH_DAI","change":3.86,"volume":2261.1989862001265,"buy_price":0.0050377199279606055,"sell_price":0.005000957220753867},{"pair":"ETH_OMG","change":0.6,"volume":3.9925039955106945,"buy_price":0.005106105203352448,"sell_price":0.005063745087029549},{"pair":"ETH_SNT","change":1.39,"volume":1.4175811559991849,"buy_price":0.0000727792470470315,"sell_price":0.000071962495455076},{"pair":"ETH_ELF","change":2.04,"volume":0.005882474705676032,"buy_price":0.00040149968746355173,"sell_price":0.000396326840563458},{"pair":"ETH_POWR","change":2.34,"volume":2.74564585737001,"buy_price":0.0002655758848938025,"sell_price":0.000261528456878372},{"pair":"ETH_MANA","change":2.61,"volume":0.643217424835911,"buy_price":0.00015683889936370462,"sell_price":0.000155259046855612},{"pair":"ETH_BAT","change":-1.66,"volume":76.23690039749681,"buy_price":0.0009519367698180295,"sell_price":0.000948452953980156},{"pair":"ETH_REQ","change":-4.92,"volume":1.6727610289749522,"buy_price":0.00005807725322910962,"sell_price":0.000057042425147089},{"pair":"ETH_RDN","change":-2.75,"volume":12.760063735929553,"buy_price":0.0008337646087775702,"sell_price":0.00081296169208292},{"pair":"ETH_APPC","change":5.41,"volume":0.48497081678501575,"buy_price":0.000194842183167096,"sell_price":0.000191184083514302},{"pair":"ETH_ENG","change":-4.01,"volume":0.10806136634440444,"buy_price":0.0017484788383601208,"sell_price":0.001713624976403423},{"pair":"ETH_BQX","change":1.49,"volume":1.0676881712673263,"buy_price":0.00033971137689645716,"sell_price":0.00033383802843939},{"pair":"ETH_AST","change":-5.33,"volume":0.13797373666296,"buy_price":0.00014382955392414486,"sell_price":0.000141814547319529},{"pair":"ETH_LINK","change":8.02,"volume":165.7974529488383,"buy_price":0.009390634689997852,"sell_price":0.009312973615908096},{"pair":"ETH_DGX","change":8.06,"volume":68.53588026052492,"buy_price":0.24766909328716452,"sell_price":0.2414840197170916},{"pair":"ETH_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"ETH_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"ETH_ABT","change":5.39,"volume":0.029516716726333044,"buy_price":0.0009588781380040668,"sell_price":0.000923224776542828},{"pair":"ETH_ENJ","change":1.53,"volume":7.743509353745253,"buy_price":0.00033325587098650733,"sell_price":0.000330222864278483},{"pair":"ETH_BLZ","change":-4.55,"volume":0,"buy_price":0.00016784085444555984,"sell_price":0.000166005182219101},{"pair":"ETH_POLY","change":-3.13,"volume":2,"buy_price":0.00016530909927673737,"sell_price":0.000154916397750553},{"pair":"ETH_LBA","change":2.9,"volume":0.675601,"buy_price":0.0000718698157667408,"sell_price":0.000070489639061166},{"pair":"ETH_CVC","change":-1.92,"volume":0,"buy_price":0.000211354964515412,"sell_price":0.000203858188039894},{"pair":"ETH_POE","change":-11.76,"volume":9.77240871716976,"buy_price":0.000015874152705022514,"sell_price":0.000015447911374703},{"pair":"ETH_PAY","change":-4.48,"volume":0.22257855395485715,"buy_price":0.0007877001535763871,"sell_price":0.00075872067582021},{"pair":"ETH_DTA","change":0,"volume":0,"buy_price":0.00000253759398869247,"sell_price":0.000002405502807192},{"pair":"ETH_BNT","change":2.06,"volume":0,"buy_price":0.0019316966539791602,"sell_price":0.001898998896985604},{"pair":"ETH_TUSD","change":4.74,"volume":1.2629347735944412,"buy_price":0.00503365630511081,"sell_price":0.00499589611902973},{"pair":"ETH_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"ETH_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"ETH_MOC","change":-19.39,"volume":0,"buy_price":0.0000979539249787127,"sell_price":0.000078710350058342},{"pair":"ETH_REP","change":3.45,"volume":7.133554779441667,"buy_price":0.05202734393284051,"sell_price":0.05189933978780481},{"pair":"ETH_ZRX","change":6.05,"volume":48.58260779303395,"buy_price":0.0011557688844805883,"sell_price":0.00114315905301748},{"pair":"ETH_DAT","change":0,"volume":0,"buy_price":0.000007082288885148038,"sell_price":0.000006907017389003},{"pair":"ETH_REN","change":-3.86,"volume":10.641394976454631,"buy_price":0.00022351901539175245,"sell_price":0.000216714293674643},{"pair":"ETH_QKC","change":5.26,"volume":0,"buy_price":0.00004010626450847725,"sell_price":0.000039066702181676},{"pair":"ETH_MKR","change":-0.76,"volume":29.946178652660485,"buy_price":2.5500020816735125,"sell_price":2.526175697736261},{"pair":"ETH_EKO","change":21.43,"volume":0,"buy_price":0.000016536266385928428,"sell_price":0.000016190638139871},{"pair":"ETH_OST","change":0,"volume":0,"buy_price":0.00006389600479941706,"sell_price":0.000062001685838863},{"pair":"ETH_PT","change":4.56,"volume":0.07439425452803085,"buy_price":0,"sell_price":0.005062908},{"pair":"ETH_ABYSS","change":-1.72,"volume":9.18180501702786,"buy_price":0.000057227176357409056,"sell_price":0.000056884655279902},{"pair":"ETH_WBTC","change":2.57,"volume":372.77354906500904,"buy_price":48.63032684442672,"sell_price":48.87014343522143},{"pair":"ETH_MLN","change":0,"volume":0,"buy_price":0.020034559201893787,"sell_price":0.019914646614172846},{"pair":"ETH_USDC","change":4.51,"volume":974.9378606354359,"buy_price":0.00502463301211022,"sell_price":0.005026371153584953},{"pair":"ETH_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"ETH_CDT","change":-4.62,"volume":0,"buy_price":0.00006243751415420452,"sell_price":0.000061626100924151},{"pair":"ETH_MCO","change":5.09,"volume":0.13323820233566777,"buy_price":0.01647264781238806,"sell_price":0.016323167637115773},{"pair":"ETH_PAX","change":3.18,"volume":10.019457265637435,"buy_price":0.005086740020342745,"sell_price":0.004991253092896803},{"pair":"ETH_GEN","change":4.43,"volume":6.810623901512515,"buy_price":0.00037936971680397133,"sell_price":0.000377046477813206},{"pair":"ETH_LRC","change":10.98,"volume":3.9217053410458247,"buy_price":0.00019494499400128033,"sell_price":0.000192026961030493},{"pair":"ETH_RLC","change":-3.36,"volume":17.703430594757172,"buy_price":0.001054478266367177,"sell_price":0.001038171714566545},{"pair":"ETH_NPXS","change":0,"volume":8.678993681103025,"buy_price":0.0000016525535989702706,"sell_price":0.000001632208177651},{"pair":"ETH_GNO","change":1.06,"volume":1.4999801508910857,"buy_price":0.08164465045207087,"sell_price":0.0811802527199658},{"pair":"ETH_MYB","change":0,"volume":1.2563604001752076,"buy_price":0.0000041061190135917895,"sell_price":0.000004082260718267},{"pair":"ETH_BAM","change":2.86,"volume":0,"buy_price":0.000036042179133765253,"sell_price":0.000035462460322531},{"pair":"ETH_SPN","change":0,"volume":0,"buy_price":0.000010996946531851507,"sell_price":0.000010934395501238},{"pair":"ETH_EQUAD","change":0,"volume":0,"buy_price":0.000009466049189665083,"sell_price":0.000009410424723584},{"pair":"ETH_UPP","change":-1.75,"volume":2.9689798688422755,"buy_price":0.00005592615925980045,"sell_price":0.000055591425143079},{"pair":"ETH_CND","change":20.45,"volume":11.612620974940192,"buy_price":0.00005200084074582211,"sell_price":0.000050352558424652},{"pair":"ETH_USDT","change":7.3,"volume":145.5656051780301,"buy_price":0.005083133375574172,"sell_price":0.004995009082652337},{"pair":"ETH_SNX","change":-4.04,"volume":86.96853377698558,"buy_price":0.0022699998838337553,"sell_price":0.002255103007079998},{"pair":"WETH_ETH","change":0,"volume":248.2732196521362,"buy_price":1,"sell_price":1},{"pair":"WETH_KNC","change":1.61,"volume":0,"buy_price":0.0009980188586821604,"sell_price":0.000997369622381961},{"pair":"WETH_DAI","change":5.26,"volume":445.31861168073226,"buy_price":0.0050377199279606055,"sell_price":0.005000957220753867},{"pair":"WETH_OMG","change":0.6,"volume":0.001994822,"buy_price":0.005106105203352448,"sell_price":0.005063745087029549},{"pair":"WETH_SNT","change":2.51,"volume":0,"buy_price":0.0000727792470470315,"sell_price":0.000071962495455076},{"pair":"WETH_ELF","change":2.06,"volume":0,"buy_price":0.00040149968746355173,"sell_price":0.000396326840563458},{"pair":"WETH_POWR","change":0.69,"volume":0,"buy_price":0.0002655758848938025,"sell_price":0.000261528456878372},{"pair":"WETH_MANA","change":3.87,"volume":0,"buy_price":0.00015683889936370462,"sell_price":0.000155259046855612},{"pair":"WETH_BAT","change":-1.25,"volume":7.2,"buy_price":0.0009519367698180295,"sell_price":0.000948452953980156},{"pair":"WETH_REQ","change":-3.11,"volume":0,"buy_price":0.00005807725322910962,"sell_price":0.000057042425147089},{"pair":"WETH_RDN","change":-2.79,"volume":0,"buy_price":0.0008337646087775702,"sell_price":0.00081296169208292},{"pair":"WETH_APPC","change":5.22,"volume":0,"buy_price":0.000194842183167096,"sell_price":0.000191184083514302},{"pair":"WETH_ENG","change":-5.85,"volume":0,"buy_price":0.0017484788383601208,"sell_price":0.001713624976403423},{"pair":"WETH_BQX","change":-0.4,"volume":0,"buy_price":0.00033971137689645716,"sell_price":0.00033383802843939},{"pair":"WETH_AST","change":-7.18,"volume":0,"buy_price":0.00014382955392414486,"sell_price":0.000141814547319529},{"pair":"WETH_LINK","change":6.91,"volume":0,"buy_price":0.009390634689997852,"sell_price":0.009312973615908096},{"pair":"WETH_DGX","change":5.36,"volume":0,"buy_price":0.24766909328716452,"sell_price":0.2414840197170916},{"pair":"WETH_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WETH_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WETH_ABT","change":-2.8,"volume":0,"buy_price":0.0009588781380040668,"sell_price":0.000923224776542828},{"pair":"WETH_ENJ","change":1.56,"volume":0,"buy_price":0.00033325587098650733,"sell_price":0.000330222864278483},{"pair":"WETH_BLZ","change":-5.69,"volume":0,"buy_price":0.00016784085444555984,"sell_price":0.000166005182219101},{"pair":"WETH_POLY","change":0.65,"volume":0,"buy_price":0.00016530909927673737,"sell_price":0.000154916397750553},{"pair":"WETH_LBA","change":2.9,"volume":0,"buy_price":0.0000718698157667408,"sell_price":0.000070489639061166},{"pair":"WETH_CVC","change":-2.29,"volume":0,"buy_price":0.000211354964515412,"sell_price":0.000203858188039894},{"pair":"WETH_POE","change":-6.71,"volume":0,"buy_price":0.000015874152705022514,"sell_price":0.000015447911374703},{"pair":"WETH_PAY","change":-8.18,"volume":0,"buy_price":0.0007877001535763871,"sell_price":0.00075872067582021},{"pair":"WETH_DTA","change":26.88,"volume":0,"buy_price":0.00000253759398869247,"sell_price":0.000002405502807192},{"pair":"WETH_BNT","change":0.21,"volume":0,"buy_price":0.0019316966539791602,"sell_price":0.001898998896985604},{"pair":"WETH_TUSD","change":4.73,"volume":10.664796,"buy_price":0.00503365630511081,"sell_price":0.00499589611902973},{"pair":"WETH_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WETH_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WETH_MOC","change":23.99,"volume":0,"buy_price":0.0000979539249787127,"sell_price":0.000078710350058342},{"pair":"WETH_REP","change":3.42,"volume":0.3691945062586755,"buy_price":0.05202734393284051,"sell_price":0.05189933978780481},{"pair":"WETH_ZRX","change":6.05,"volume":0,"buy_price":0.0011557688844805883,"sell_price":0.00114315905301748},{"pair":"WETH_DAT","change":-3.1,"volume":0,"buy_price":0.000007082288885148038,"sell_price":0.000006907017389003},{"pair":"WETH_REN","change":-6.87,"volume":0,"buy_price":0.00022351901539175245,"sell_price":0.000216714293674643},{"pair":"WETH_QKC","change":2.07,"volume":0,"buy_price":0.00004010626450847725,"sell_price":0.000039066702181676},{"pair":"WETH_MKR","change":-1.69,"volume":0,"buy_price":2.5500020816735125,"sell_price":2.526175697736261},{"pair":"WETH_EKO","change":14.29,"volume":0,"buy_price":0.000016536266385928428,"sell_price":0.000016190638139871},{"pair":"WETH_OST","change":4.75,"volume":0,"buy_price":0.00006389600479941706,"sell_price":0.000062001685838863},{"pair":"WETH_PT","change":4.56,"volume":0,"buy_price":0,"sell_price":0.005062908},{"pair":"WETH_ABYSS","change":-1.83,"volume":0,"buy_price":0.000057227176357409056,"sell_price":0.000056884655279902},{"pair":"WETH_WBTC","change":1.98,"volume":0,"buy_price":48.63032684442672,"sell_price":48.87014343522143},{"pair":"WETH_MLN","change":0,"volume":0,"buy_price":0.020034559201893787,"sell_price":0.019914646614172846},{"pair":"WETH_USDC","change":5.12,"volume":1.2985107190888343,"buy_price":0.00502463301211022,"sell_price":0.005026371153584953},{"pair":"WETH_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WETH_CDT","change":-5.91,"volume":0,"buy_price":0.00006243751415420452,"sell_price":0.000061626100924151},{"pair":"WETH_MCO","change":6.05,"volume":0,"buy_price":0.01647264781238806,"sell_price":0.016323167637115773},{"pair":"WETH_PAX","change":5.17,"volume":0,"buy_price":0.005086740020342745,"sell_price":0.004991253092896803},{"pair":"WETH_GEN","change":5.09,"volume":0,"buy_price":0.00037936971680397133,"sell_price":0.000377046477813206},{"pair":"WETH_LRC","change":13.75,"volume":0,"buy_price":0.00019494499400128033,"sell_price":0.000192026961030493},{"pair":"WETH_RLC","change":-1.76,"volume":0,"buy_price":0.001054478266367177,"sell_price":0.001038171714566545},{"pair":"WETH_NPXS","change":22.16,"volume":0,"buy_price":0.0000016525535989702706,"sell_price":0.000001632208177651},{"pair":"WETH_GNO","change":1.06,"volume":0,"buy_price":0.08164465045207087,"sell_price":0.0811802527199658},{"pair":"WETH_MYB","change":-1.97,"volume":0,"buy_price":0.0000041061190135917895,"sell_price":0.000004082260718267},{"pair":"WETH_BAM","change":0,"volume":0,"buy_price":0.000036042179133765253,"sell_price":0.000035462460322531},{"pair":"WETH_SPN","change":-0.03,"volume":0,"buy_price":0.000010996946531851507,"sell_price":0.000010934395501238},{"pair":"WETH_EQUAD","change":-4.92,"volume":0,"buy_price":0.000009466049189665083,"sell_price":0.000009410424723584},{"pair":"WETH_UPP","change":-1.75,"volume":0,"buy_price":0.00005592615925980045,"sell_price":0.000055591425143079},{"pair":"WETH_CND","change":19.39,"volume":0,"buy_price":0.00005200084074582211,"sell_price":0.000050352558424652},{"pair":"WETH_USDT","change":3.29,"volume":0,"buy_price":0.005083133375574172,"sell_price":0.004995009082652337},{"pair":"WETH_SNX","change":-2.78,"volume":0,"buy_price":0.0022699998838337553,"sell_price":0.002255103007079998},{"pair":"DAI_ETH","change":-4.36,"volume":459312.4501064164,"buy_price":199.96171849861486,"sell_price":198.50249999999997},{"pair":"DAI_WETH","change":-5,"volume":90574.62842552792,"buy_price":199.96171849861486,"sell_price":198.50249999999997},{"pair":"DAI_KNC","change":-3.57,"volume":24188.635779354954,"buy_price":0.19956556607611103,"sell_price":0.1979803634668752},{"pair":"DAI_OMG","change":-3.78,"volume":0,"buy_price":1.0210255712970748,"sell_price":1.0051660591380829},{"pair":"DAI_SNT","change":-1.3,"volume":0,"buy_price":0.01455306331055966,"sell_price":0.014284735254071222},{"pair":"DAI_ELF","change":-0.36,"volume":0,"buy_price":0.08028456748186857,"sell_price":0.07867186866894782},{"pair":"DAI_POWR","change":-2.28,"volume":0,"buy_price":0.05310501033515507,"sell_price":0.05191405251149904},{"pair":"DAI_MANA","change":-3.97,"volume":0,"buy_price":0.031361775844197685,"sell_price":0.030819308948456123},{"pair":"DAI_BAT","change":-4.91,"volume":0,"buy_price":0.19035091239483354,"sell_price":0.1882702824974459},{"pair":"DAI_REQ","change":-9.14,"volume":0,"buy_price":0.011613227361371988,"sell_price":0.011323063997760034},{"pair":"DAI_RDN","change":-4.85,"volume":0,"buy_price":0.16672100399448822,"sell_price":0.16137492828268982},{"pair":"DAI_APPC","change":-0.73,"volume":0,"buy_price":0.0389609777821144,"sell_price":0.03795051853779773},{"pair":"DAI_ENG","change":-10.56,"volume":0,"buy_price":0.3496288332769516,"sell_price":0.3401588418785204},{"pair":"DAI_BQX","change":-0.27,"volume":0,"buy_price":0.06792927071774622,"sell_price":0.06626768324029},{"pair":"DAI_AST","change":-9.46,"volume":0,"buy_price":0.028760404773561198,"sell_price":0.028150542179294805},{"pair":"DAI_LINK","change":2.46,"volume":16112.133447378877,"buy_price":1.877767450404678,"sell_price":1.8486485451917967},{"pair":"DAI_DGX","change":0.77,"volume":0,"buy_price":49.52433751269517,"sell_price":47.93518162389197},{"pair":"DAI_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"DAI_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"DAI_ABT","change":1.48,"volume":0,"buy_price":0.19173892030604517,"sell_price":0.18326242620569272},{"pair":"DAI_ENJ","change":-2.11,"volume":0,"buy_price":0.06663841666221469,"sell_price":0.06555006411643957},{"pair":"DAI_BLZ","change":-8.17,"volume":0,"buy_price":0.033561745689210026,"sell_price":0.032952443683447095},{"pair":"DAI_POLY","change":-3.74,"volume":0,"buy_price":0.033055491574834533,"sell_price":0.030751292244479148},{"pair":"DAI_LBA","change":-5.62,"volume":0,"buy_price":0.014371211868896335,"sell_price":0.013992369577739102},{"pair":"DAI_CVC","change":-6.2,"volume":0,"buy_price":0.04226290191771555,"sell_price":0.04046635997138905},{"pair":"DAI_POE","change":-15.55,"volume":0,"buy_price":0.0031742228546057373,"sell_price":0.003066449027656982},{"pair":"DAI_PAY","change":-12.77,"volume":0,"buy_price":0.1575098763707572,"sell_price":0.15060795095200122},{"pair":"DAI_DTA","change":-7.86,"volume":0,"buy_price":0.0005074216548307009,"sell_price":0.00047749832098462996},{"pair":"DAI_BNT","change":-6.33,"volume":0,"buy_price":0.38626538254769704,"sell_price":0.3769560285488848},{"pair":"DAI_TUSD","change":-1.25,"volume":0,"buy_price":1.0065385651013454,"sell_price":0.9916978693676989},{"pair":"DAI_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"DAI_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"DAI_MOC","change":-4.36,"volume":0,"buy_price":0.019587035172427786,"sell_price":0.015624201262456032},{"pair":"DAI_REP","change":-1.09,"volume":0,"buy_price":10.40347710172927,"sell_price":10.302148696228723},{"pair":"DAI_ZRX","change":-0.11,"volume":83.83332679792487,"buy_price":0.2311095323279655,"sell_price":0.22691992992160231},{"pair":"DAI_DAT","change":-7.95,"volume":0,"buy_price":0.0014161866563778408,"sell_price":0.001371060219260568},{"pair":"DAI_REN","change":-11.21,"volume":952.7904747603438,"buy_price":0.04469524643485316,"sell_price":0.04301832908015082},{"pair":"DAI_QKC","change":1.32,"volume":0,"buy_price":0.008019717573675115,"sell_price":0.007754838049818139},{"pair":"DAI_MKR","change":-5.08,"volume":3714.7799150675837,"buy_price":509.9027984264808,"sell_price":501.4521914398921},{"pair":"DAI_EKO","change":13.73,"volume":0,"buy_price":0.0033066202440811274,"sell_price":0.003213882147359743},{"pair":"DAI_OST","change":-4.97,"volume":1805.132877897846,"buy_price":0.012776754924887179,"sell_price":0.012307489643228902},{"pair":"DAI_PT","change":0.01,"volume":0,"buy_price":0,"sell_price":1.0049998952699999},{"pair":"DAI_ABYSS","change":-6.11,"volume":0,"buy_price":0.011443244529250817,"sell_price":0.011291746284698746},{"pair":"DAI_WBTC","change":-1.98,"volume":125938.84555973407,"buy_price":9724.203726960888,"sell_price":9700.84564725004},{"pair":"DAI_MLN","change":-5.57,"volume":0,"buy_price":4.006144887372919,"sell_price":3.953107139529845},{"pair":"DAI_USDC","change":0.56,"volume":1951.8880929494035,"buy_price":1.0047342519264308,"sell_price":0.997747239914497},{"pair":"DAI_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"DAI_CDT","change":-10.61,"volume":0,"buy_price":0.012485112629056324,"sell_price":0.012232935098696284},{"pair":"DAI_MCO","change":-1.14,"volume":0,"buy_price":3.293898964787565,"sell_price":3.2401895838865733},{"pair":"DAI_PAX","change":0.59,"volume":0,"buy_price":1.0171532760234143,"sell_price":0.9907762170727477},{"pair":"DAI_GEN","change":1.19,"volume":0,"buy_price":0.07585942051845496,"sell_price":0.07484466846211592},{"pair":"DAI_LRC","change":9.53,"volume":0,"buy_price":0.038981536013198176,"sell_price":0.03811783183195543},{"pair":"DAI_RLC","change":-3.85,"volume":0,"buy_price":0.21085528626222086,"sell_price":0.2060796807707456},{"pair":"DAI_NPXS","change":16.05,"volume":0,"buy_price":0.0003304474575611661,"sell_price":0.0003239974037841676},{"pair":"DAI_GNO","change":-3.35,"volume":0,"buy_price":16.325804610614803,"sell_price":16.11448311554501},{"pair":"DAI_MYB","change":-6.87,"volume":0,"buy_price":0.0008210666143176515,"sell_price":0.000810338958227795},{"pair":"DAI_BAM","change":-7.75,"volume":0,"buy_price":0.007207056078022618,"sell_price":0.00703938703017321},{"pair":"DAI_SPN","change":-4.97,"volume":0,"buy_price":0.00219896832674641,"sell_price":0.002170504842984496},{"pair":"DAI_EQUAD","change":-4.35,"volume":0,"buy_price":0.0018928474633578504,"sell_price":0.001867992833693233},{"pair":"DAI_UPP","change":-6.93,"volume":0,"buy_price":0.01118309091461692,"sell_price":0.011035036869464039},{"pair":"DAI_CND","change":10.86,"volume":4.8260837058040025,"buy_price":0.010398177478907382,"sell_price":0.009995108728689483},{"pair":"DAI_USDT","change":-1.88,"volume":4842,"buy_price":1.0164320851374764,"sell_price":0.9915217904291954},{"pair":"DAI_SNX","change":-6.39,"volume":700,"buy_price":0.4539130777630538,"sell_price":0.4476435846628973},{"pair":"TUSD_ETH","change":-4.93,"volume":267.46,"buy_price":200.16429008420081,"sell_price":198.66274917988986},{"pair":"TUSD_WETH","change":-4.52,"volume":2112.3853435973306,"buy_price":200.16429008420081,"sell_price":198.66274917988986},{"pair":"TUSD_KNC","change":-4.22,"volume":0,"buy_price":0.19976773633875897,"sell_price":0.19814019113090897},{"pair":"TUSD_DAI","change":-0.17,"volume":0,"buy_price":1.008371633023266,"sell_price":0.9935039100059846},{"pair":"TUSD_OMG","change":-2.42,"volume":0,"buy_price":1.0220599231242866,"sell_price":1.0059775201354508},{"pair":"TUSD_SNT","change":-1.39,"volume":0,"buy_price":0.01456780631803173,"sell_price":0.014296267184950728},{"pair":"TUSD_ELF","change":-5.03,"volume":0,"buy_price":0.08036589991017033,"sell_price":0.07873537972011646},{"pair":"TUSD_POWR","change":-4.98,"volume":0,"buy_price":0.053158808463251404,"sell_price":0.05195596223223166},{"pair":"TUSD_MANA","change":-4.61,"volume":0,"buy_price":0.03139354694872335,"sell_price":0.030844189083385216},{"pair":"TUSD_BAT","change":-7.95,"volume":0,"buy_price":0.19054374773567317,"sell_price":0.18842227130548533},{"pair":"TUSD_REQ","change":-6.79,"volume":0,"buy_price":0.011624992162645086,"sell_price":0.011332204999608785},{"pair":"TUSD_RDN","change":-5.68,"volume":0,"buy_price":0.16688990101329376,"sell_price":0.16150520472712798},{"pair":"TUSD_APPC","change":-1.32,"volume":0,"buy_price":0.039000447272097595,"sell_price":0.037981155630388896},{"pair":"TUSD_ENG","change":-11.16,"volume":0,"buy_price":0.34998302540760173,"sell_price":0.3404334488756279},{"pair":"TUSD_BQX","change":-3.68,"volume":0,"buy_price":0.06799808659000572,"sell_price":0.06632118051056347},{"pair":"TUSD_AST","change":-7.75,"volume":0,"buy_price":0.028789540554353735,"sell_price":0.028173267844199212},{"pair":"TUSD_LINK","change":0.05,"volume":0,"buy_price":1.8796697261634894,"sell_price":1.8501409415760819},{"pair":"TUSD_DGX","change":-3.03,"volume":0,"buy_price":49.57450823362299,"sell_price":47.973879240008145},{"pair":"TUSD_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"TUSD_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"TUSD_ABT","change":-4.09,"volume":0,"buy_price":0.19193316177084438,"sell_price":0.1834103722189877},{"pair":"TUSD_ENJ","change":-4.17,"volume":0,"buy_price":0.06670592483240625,"sell_price":0.06560298205962108},{"pair":"TUSD_BLZ","change":-11.98,"volume":0,"buy_price":0.03359574547722117,"sell_price":0.03297904587775517},{"pair":"TUSD_POLY","change":-3.9,"volume":0,"buy_price":0.03308897850118681,"sell_price":0.03077611747017017},{"pair":"TUSD_LBA","change":-1.75,"volume":0,"buy_price":0.014385770651431977,"sell_price":0.014003665484589388},{"pair":"TUSD_CVC","change":-2.25,"volume":0,"buy_price":0.0423057164279989,"sell_price":0.040499028078836284},{"pair":"TUSD_POE","change":-10.25,"volume":0,"buy_price":0.0031774385068890276,"sell_price":0.0030689245427857896},{"pair":"TUSD_PAY","change":-8.27,"volume":0,"buy_price":0.1576694420398335,"sell_price":0.1507295353180669},{"pair":"TUSD_DTA","change":-4.52,"volume":0,"buy_price":0.0005079356992685638,"sell_price":0.0004778838008367053},{"pair":"TUSD_BNT","change":-4.54,"volume":0,"buy_price":0.38665668940176473,"sell_price":0.37726034156473853},{"pair":"TUSD_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"TUSD_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"TUSD_MOC","change":-4.92,"volume":0,"buy_price":0.019606877854325095,"sell_price":0.015636814531501727},{"pair":"TUSD_REP","change":-0.5,"volume":0,"buy_price":10.414016363283574,"sell_price":10.310465522866545},{"pair":"TUSD_ZRX","change":3.54,"volume":0,"buy_price":0.23134365826346567,"sell_price":0.22710312022233206},{"pair":"TUSD_DAT","change":-2.57,"volume":0,"buy_price":0.0014176213268668832,"sell_price":0.0013721670631326407},{"pair":"TUSD_REN","change":-11.07,"volume":0,"buy_price":0.044740525036209684,"sell_price":0.043053057367982595},{"pair":"TUSD_QKC","change":2.47,"volume":0,"buy_price":0.008027841963268528,"sell_price":0.0077610984568037555},{"pair":"TUSD_MKR","change":-4.7,"volume":0,"buy_price":510.4193563914129,"sell_price":501.8570090237121},{"pair":"TUSD_EKO","change":9.12,"volume":0,"buy_price":0.0033099700217825967,"sell_price":0.003216476683843551},{"pair":"TUSD_OST","change":-5.6,"volume":0,"buy_price":0.012789698439892005,"sell_price":0.012317425362536369},{"pair":"TUSD_PT","change":-0.16,"volume":0,"buy_price":0,"sell_price":1.0058112221248579},{"pair":"TUSD_ABYSS","change":-5.08,"volume":0,"buy_price":0.011454837129104145,"sell_price":0.011300862004055669},{"pair":"TUSD_WBTC","change":-2.95,"volume":0,"buy_price":9734.054849377328,"sell_price":9708.677047656636},{"pair":"TUSD_MLN","change":-6.2,"volume":0,"buy_price":4.010203319796963,"sell_price":3.956298445317563},{"pair":"TUSD_USDC","change":-1.38,"volume":300.37,"buy_price":1.0057520998026817,"sell_price":0.9985527117696812},{"pair":"TUSD_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"TUSD_CDT","change":-10.19,"volume":0,"buy_price":0.012497760695298588,"sell_price":0.012242810630829189},{"pair":"TUSD_MCO","change":-1.8,"volume":0,"buy_price":3.2972358551737195,"sell_price":3.2428053581136265},{"pair":"TUSD_PAX","change":3.02,"volume":0,"buy_price":1.0181837050147988,"sell_price":0.9915760612875072},{"pair":"TUSD_GEN","change":-0.71,"volume":0,"buy_price":0.07593627004351124,"sell_price":0.07490508985096586},{"pair":"TUSD_LRC","change":7.04,"volume":0,"buy_price":0.039021026329735066,"sell_price":0.03814860399497732},{"pair":"TUSD_RLC","change":-3.94,"volume":0,"buy_price":0.2110688935966048,"sell_price":0.20624604693658977},{"pair":"TUSD_NPXS","change":-4.52,"volume":0,"buy_price":0.0003307822179639753,"sell_price":0.0003242589638060457},{"pair":"TUSD_GNO","change":-2.22,"volume":0,"buy_price":16.34234349691149,"sell_price":16.12749218446664},{"pair":"TUSD_MYB","change":-7.5,"volume":0,"buy_price":0.0008218983973568395,"sell_price":0.0008109931371599941},{"pair":"TUSD_BAM","change":-4.52,"volume":0,"buy_price":0.007214357199397718,"sell_price":0.007045069860356773},{"pair":"TUSD_SPN","change":-5.61,"volume":0,"buy_price":0.002201195995641971,"sell_price":0.002172257070896161},{"pair":"TUSD_EQUAD","change":1.18,"volume":0,"buy_price":0.0018947650159514358,"sell_price":0.0018695008465376027},{"pair":"TUSD_UPP","change":-6.98,"volume":0,"buy_price":0.011194419965373912,"sell_price":0.011043945349752126},{"pair":"TUSD_CND","change":10.67,"volume":0,"buy_price":0.010408711371669068,"sell_price":0.01000317768488239},{"pair":"TUSD_USDT","change":3.23,"volume":0,"buy_price":1.0174617835251114,"sell_price":0.992322236538233},{"pair":"TUSD_SNX","change":-8.16,"volume":0,"buy_price":0.45437291523880197,"sell_price":0.44800496307034904},{"pair":"WBTC_ETH","change":-1.94,"volume":7.826114880000002,"buy_price":0.02046239134381761,"sell_price":0.0205633},{"pair":"WBTC_WETH","change":-2.51,"volume":0,"buy_price":0.02046239134381761,"sell_price":0.0205633},{"pair":"WBTC_KNC","change":-0.21,"volume":0.5414,"buy_price":0.00002042185245486457,"sell_price":0.00002050921075592698},{"pair":"WBTC_DAI","change":2.62,"volume":12.879744189999998,"buy_price":0.00010308379664647856,"sell_price":0.00010283618361752799},{"pair":"WBTC_OMG","change":-1.83,"volume":0,"buy_price":0.0001044831229137012,"sell_price":0.00010412730934811473},{"pair":"WBTC_SNT","change":-1.71,"volume":0,"buy_price":0.0000014892374347847408,"sell_price":0.0000014797863827913644},{"pair":"WBTC_ELF","change":-1.32,"volume":0,"buy_price":0.000008215643729299658,"sell_price":0.000008149787720558555},{"pair":"WBTC_POWR","change":-0.31,"volume":0,"buy_price":0.000005434317688177646,"sell_price":0.000005377888117327027},{"pair":"WBTC_MANA","change":-0.19,"volume":0,"buy_price":0.000003209298936713751,"sell_price":0.0000031926383582060066},{"pair":"WBTC_BAT","change":-3.66,"volume":0,"buy_price":0.000019478902718586143,"sell_price":0.000019503322628580142},{"pair":"WBTC_REQ","change":-6.9,"volume":0,"buy_price":0.000001188399483748036,"sell_price":0.0000011729805010271353},{"pair":"WBTC_RDN","change":-1.44,"volume":0,"buy_price":0.00001706081771343163,"sell_price":0.00001671717516280871},{"pair":"WBTC_APPC","change":1.15,"volume":0,"buy_price":0.00000398693700224891,"sell_price":0.000003931375664529646},{"pair":"WBTC_ENG","change":-4.18,"volume":0,"buy_price":0.00003577805824690841,"sell_price":0.00003523778447727651},{"pair":"WBTC_BQX","change":-0.24,"volume":0,"buy_price":0.000006951307138002427,"sell_price":0.000006864811530207709},{"pair":"WBTC_AST","change":-10.14,"volume":0,"buy_price":0.00000294309661920257,"sell_price":0.000002916175080895671},{"pair":"WBTC_LINK","change":3.96,"volume":0,"buy_price":0.00019215484199356544,"sell_price":0.00019150547035600294},{"pair":"WBTC_DGX","change":0.76,"volume":0,"buy_price":0.005067901910610431,"sell_price":0.00496570834264847},{"pair":"WBTC_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WBTC_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WBTC_ABT","change":-1.56,"volume":0,"buy_price":0.000019620939710870365,"sell_price":0.000018984548047483138},{"pair":"WBTC_ENJ","change":-0.13,"volume":0,"buy_price":0.000006819212049750706,"sell_price":0.00000679047182501773},{"pair":"WBTC_BLZ","change":-7.03,"volume":0,"buy_price":0.000003434425247145775,"sell_price":0.0000034136143635260396},{"pair":"WBTC_POLY","change":4.99,"volume":0,"buy_price":0.000003382619482094597,"sell_price":0.000003185592361863947},{"pair":"WBTC_LBA","change":0.81,"volume":0,"buy_price":0.0000014706282960271236,"sell_price":0.0000014494995949064748},{"pair":"WBTC_CVC","change":-3.91,"volume":0,"buy_price":0.000004324827996373045,"sell_price":0.000004191997078120753},{"pair":"WBTC_POE","change":-12.84,"volume":0,"buy_price":3.248231249016916e-7,"sell_price":3.1766003597143024e-7},{"pair":"WBTC_PAY","change":-9.96,"volume":0,"buy_price":0.000016118228804065264,"sell_price":0.000015601800873093725},{"pair":"WBTC_DTA","change":23.7,"volume":0,"buy_price":5.19252412683444e-8,"sell_price":4.946507587513126e-8},{"pair":"WBTC_BNT","change":-3.32,"volume":0,"buy_price":0.00003952713289126461,"sell_price":0.000039049684018384074},{"pair":"WBTC_TUSD","change":1.93,"volume":0,"buy_price":0.00010300064520545238,"sell_price":0.00010273211066444406},{"pair":"WBTC_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WBTC_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WBTC_MOC","change":-2.42,"volume":0,"buy_price":0.0000020043715465773704,"sell_price":0.000001618544541354704},{"pair":"WBTC_REP","change":0.91,"volume":0,"buy_price":0.0010646038721331774,"sell_price":0.0010672216938585667},{"pair":"WBTC_ZRX","change":4.93,"volume":0,"buy_price":0.000023649795217249326,"sell_price":0.00002350712255491435},{"pair":"WBTC_DAT","change":-4.24,"volume":0,"buy_price":1.449205667778689e-7,"sell_price":1.420310706752854e-7},{"pair":"WBTC_REN","change":-8.76,"volume":0,"buy_price":0.000004573733565730831,"sell_price":0.000004456361035119786},{"pair":"WBTC_QKC","change":0.55,"volume":0,"buy_price":8.206700797111243e-7,"sell_price":8.033403169724581e-7},{"pair":"WBTC_MKR","change":-2.22,"volume":0,"buy_price":0.05217914052275297,"sell_price":0.05194650872526006},{"pair":"WBTC_EKO","change":15.15,"volume":0,"buy_price":3.38371554154484e-7,"sell_price":3.329329492616093e-7},{"pair":"WBTC_OST","change":0.6,"volume":0,"buy_price":0.00000130746505551212,"sell_price":0.0000012749592664102917},{"pair":"WBTC_PT","change":2.44,"volume":0,"buy_price":0,"sell_price":0.0001041100960764},{"pair":"WBTC_ABYSS","change":-4.21,"volume":0,"buy_price":0.0000011710048781269709,"sell_price":0.0000011697362319172088},{"pair":"WBTC_MLN","change":-2.42,"volume":0,"buy_price":0.0004099549907900329,"sell_price":0.0004095108527212205},{"pair":"WBTC_USDC","change":2.48,"volume":1.79296356,"buy_price":0.00010281600705286437,"sell_price":0.00010335877794251346},{"pair":"WBTC_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"WBTC_CDT","change":-6.55,"volume":0,"buy_price":0.000001277620849158484,"sell_price":0.0000012672360011335944},{"pair":"WBTC_MCO","change":2.48,"volume":0,"buy_price":0.00033706976600596553,"sell_price":0.0003356581930723028},{"pair":"WBTC_PAX","change":2.62,"volume":0,"buy_price":0.00010408686496051201,"sell_price":0.00010263663472516484},{"pair":"WBTC_GEN","change":1.9,"volume":0,"buy_price":0.000007762811609236121,"sell_price":0.000007753319837216299},{"pair":"WBTC_LRC","change":10.9,"volume":0,"buy_price":0.000003989040757772374,"sell_price":0.0000039487080077583375},{"pair":"WBTC_RLC","change":-2.65,"volume":0,"buy_price":0.000021577146949955524,"sell_price":0.00002134823641814624},{"pair":"WBTC_NPXS","change":-1.51,"volume":0,"buy_price":3.38151984587639e-8,"sell_price":3.356358641949081e-8},{"pair":"WBTC_GNO","change":-1,"volume":0,"buy_price":0.0016706447886794694,"sell_price":0.001669333890756473},{"pair":"WBTC_MYB","change":-3.87,"volume":0,"buy_price":8.402101416040553e-8,"sell_price":8.39447518279398e-8},{"pair":"WBTC_BAM","change":-2.42,"volume":0,"buy_price":7.375091743190818e-7,"sell_price":7.292252103503018e-7},{"pair":"WBTC_SPN","change":-2.42,"volume":0,"buy_price":2.2502382352178337e-7,"sell_price":2.248472550106074e-7},{"pair":"WBTC_EQUAD","change":-2.03,"volume":0,"buy_price":1.936980029987545e-7,"sell_price":1.9350938671847488e-7},{"pair":"WBTC_UPP","change":-3.94,"volume":0,"buy_price":0.0000011443829571307058,"sell_price":0.0000011431431526446765},{"pair":"WBTC_CND","change":12.92,"volume":0,"buy_price":0.0000010640615535485486,"sell_price":0.0000010354147646536465},{"pair":"WBTC_USDT","change":1.28,"volume":0,"buy_price":0.00010401306438381932,"sell_price":0.00010271387026930481},{"pair":"WBTC_SNX","change":-5.22,"volume":0,"buy_price":0.000046449625973426816,"sell_price":0.00004637235966548813},{"pair":"USDC_ETH","change":-4.86,"volume":196668.02500499997,"buy_price":198.9506881692911,"sell_price":199.01951},{"pair":"USDC_WETH","change":-4.29,"volume":263.16952799999996,"buy_price":198.9506881692911,"sell_price":199.01951},{"pair":"USDC_KNC","change":-3.37,"volume":682.391662,"buy_price":0.1985565387407463,"sell_price":0.1984960135353429},{"pair":"USDC_DAI","change":-0.56,"volume":1959,"buy_price":1.002257846471914,"sell_price":0.9952880556053965},{"pair":"USDC_OMG","change":-5.08,"volume":0,"buy_price":1.0158631440717678,"sell_price":1.0077840659855282},{"pair":"USDC_SNT","change":-4.65,"volume":0,"buy_price":0.014479481284449765,"sell_price":0.014321940583846452},{"pair":"USDC_ELF","change":-2.96,"volume":0,"buy_price":0.07987863912062892,"sell_price":0.07887677360878753},{"pair":"USDC_POWR","change":-0.64,"volume":0,"buy_price":0.05283650506079045,"sell_price":0.05204926533898973},{"pair":"USDC_MANA","change":-0.61,"volume":0,"buy_price":0.031203206960123228,"sell_price":0.030899579428270943},{"pair":"USDC_BAT","change":-5.88,"volume":0,"buy_price":0.18938847544894905,"sell_price":0.1887606421591832},{"pair":"USDC_REQ","change":-11,"volume":0,"buy_price":0.011554509496913543,"sell_price":0.011352555501985332},{"pair":"USDC_RDN","change":-7.53,"volume":0,"buy_price":0.16587804268749737,"sell_price":0.16179523760711362},{"pair":"USDC_APPC","change":0.68,"volume":0,"buy_price":0.038763986425500815,"sell_price":0.038049362620815465},{"pair":"USDC_ENG","change":-7.78,"volume":0,"buy_price":0.3478610681411888,"sell_price":0.3410448031275708},{"pair":"USDC_BQX","change":-0.9,"volume":0,"buy_price":0.06758581221248758,"sell_price":0.06644028083937346},{"pair":"USDC_AST","change":-8.25,"volume":0,"buy_price":0.028614988732290784,"sell_price":0.028223861718404478},{"pair":"USDC_LINK","change":3.36,"volume":125.063754,"buy_price":1.8682732339214905,"sell_price":1.8534634456809576},{"pair":"USDC_DGX","change":3.4,"volume":856.4205939999999,"buy_price":49.27393654774574,"sell_price":48.06003127692591},{"pair":"USDC_STORM","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"USDC_IOST","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"USDC_ABT","change":0.84,"volume":0,"buy_price":0.19076946542639758,"sell_price":0.18373974264741313},{"pair":"USDC_ENJ","change":-1.48,"volume":0,"buy_price":0.06630148486922213,"sell_price":0.06572079263950019},{"pair":"USDC_BLZ","change":-8.75,"volume":0,"buy_price":0.03339205349486595,"sell_price":0.03303827002270619},{"pair":"USDC_POLY","change":-7.76,"volume":0,"buy_price":0.03288835906175256,"sell_price":0.030831385571280165},{"pair":"USDC_LBA","change":-1.51,"volume":0,"buy_price":0.014298549305393251,"sell_price":0.014028813426030119},{"pair":"USDC_CVC","change":-2.77,"volume":0,"buy_price":0.04204921563833732,"sell_price":0.04057175669318756},{"pair":"USDC_POE","change":-15.44,"volume":0,"buy_price":0.003158173604768643,"sell_price":0.0030744357523168177},{"pair":"USDC_PAY","change":-9.25,"volume":0,"buy_price":0.1567134876250785,"sell_price":0.15100021712860703},{"pair":"USDC_DTA","change":21.41,"volume":0,"buy_price":0.0005048560703446233,"sell_price":0.0004787419899909764},{"pair":"USDC_BNT","change":-2.36,"volume":0,"buy_price":0.38431237864347095,"sell_price":0.37793782996861536},{"pair":"USDC_TUSD","change":1.4,"volume":298.127647,"buy_price":1.0014493859094868,"sell_price":0.9942807976201986},{"pair":"USDC_LEND","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"USDC_MTL","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"USDC_MOC","change":-23.28,"volume":0,"buy_price":0.019488000783398005,"sell_price":0.015664895300539695},{"pair":"USDC_REP","change":-1.58,"volume":0,"buy_price":10.350875879059013,"sell_price":10.328981173892418},{"pair":"USDC_ZRX","change":1.5,"volume":0,"buy_price":0.22994101493206698,"sell_price":0.2275109545836029},{"pair":"USDC_DAT","change":-3.09,"volume":0,"buy_price":0.0014090262475139237,"sell_price":0.0013746312163208565},{"pair":"USDC_REN","change":-10.86,"volume":0,"buy_price":0.044469261931111524,"sell_price":0.04313037253712355},{"pair":"USDC_QKC","change":-2.9,"volume":0,"buy_price":0.007979168923861165,"sell_price":0.0077750359255130885},{"pair":"USDC_MKR","change":-4.47,"volume":20000,"buy_price":507.3246689820702,"sell_price":502.7582495373788},{"pair":"USDC_EKO","change":3.21,"volume":0,"buy_price":0.003289901577231177,"sell_price":0.0032222528691844376},{"pair":"USDC_OST","change":-4.84,"volume":0,"buy_price":0.012712154126112351,"sell_price":0.012339545134824454},{"pair":"USDC_PT","change":0.08,"volume":0,"buy_price":0,"sell_price":1.00761746933508},{"pair":"USDC_ABYSS","change":-6.64,"volume":0,"buy_price":0.011385386118291919,"sell_price":0.011321156220325009},{"pair":"USDC_WBTC","change":-2.92,"volume":17355.149523,"buy_price":9675.036991596247,"sell_price":9726.112000107485},{"pair":"USDC_MLN","change":-4.89,"volume":0,"buy_price":3.9858893403851727,"sell_price":3.963403210975839},{"pair":"USDC_EURS","change":0,"volume":0,"buy_price":0,"sell_price":0},{"pair":"USDC_CDT","change":-8.36,"volume":0,"buy_price":0.012421986408558844,"sell_price":0.01226479640913508},{"pair":"USDC_MCO","change":0.58,"volume":0,"buy_price":3.277244618244972,"sell_price":3.248628824786639},{"pair":"USDC_PAX","change":0.57,"volume":0,"buy_price":1.012010427585463,"sell_price":0.9933567448343062},{"pair":"USDC_GEN","change":-1.27,"volume":0,"buy_price":0.07547586622873918,"sell_price":0.07503960526161013},{"pair":"USDC_LRC","change":5.72,"volume":0,"buy_price":0.038784440711713046,"sell_price":0.03821711169107782},{"pair":"USDC_RLC","change":-6.57,"volume":0,"buy_price":0.2097891767533109,"sell_price":0.20661642592889368},{"pair":"USDC_NPXS","change":-20.94,"volume":0,"buy_price":0.00032877667575177406,"sell_price":0.000324841271734095},{"pair":"USDC_GNO","change":-2.75,"volume":0,"buy_price":16.243259392780722,"sell_price":16.15645411800376},{"pair":"USDC_MYB","change":-1.77,"volume":0,"buy_price":0.0008169152034590973,"sell_price":0.0008124495278417464},{"pair":"USDC_BAM","change":-1.46,"volume":0,"buy_price":0.007170616341783462,"sell_price":0.007057721476784562},{"pair":"USDC_SPN","change":-4.34,"volume":0,"buy_price":0.0021878500802727566,"sell_price":0.0021761580348025914},{"pair":"USDC_EQUAD","change":-4.89,"volume":0,"buy_price":0.0018832770005282288,"sell_price":0.001872858117379573},{"pair":"USDC_UPP","change":-6.95,"volume":0,"buy_price":0.011126547871402671,"sell_price":0.011063778192177263},{"pair":"USDC_CND","change":14.24,"volume":0,"buy_price":0.010345603051763023,"sell_price":0.010021141504920613},{"pair":"USDC_USDT","change":0.93,"volume":0,"buy_price":1.0112928831267731,"sell_price":0.9941042600750176},{"pair":"USDC_SNX","change":-8.72,"volume":0,"buy_price":0.4516180390329365,"sell_price":0.4488094954685878}],"error":false,"timestamp":1569311226}`
}



export function getVolumeAndChange(){
  return new Promise((resolve, rejected) => {
      resolve(JSON.parse(getvolumeAndChangeDumpData()).data);
      return;
  })
}

export function getFavoritePairs(){
  return new Promise((resolve, rejected) => {
    resolve([{base: "BITX", quote: "WETH"}])
  })
}


export function updateFavoritePairs(base, quote, to_fav){
  return new Promise((resolve, rejected) => {
    resolve("")
  })
}


export function getTokenPrice(){
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT,
          fetch("https://api.kyber.network/token_price?currency=ETH", {
              method: 'GET',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
          }))
          .then(response => response.json())
          .then((result) => resolve(result.data))
          .catch((err) => {
              rejected(new Error(`Cannot get init token price: ${err.toString}`))
          })
    })
}