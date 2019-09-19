import { timeout, calcInterval, getFormattedDate } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"
// import { converters.toT } from "../../utils/converter";
import * as converters from "../../utils/converter";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import { sortBy } from "underscore";

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
    "msg": "msg"
}

const jsonString = `{"fields":["id","addr","nonce","src","dst","src_amount","min_rate","fee","receive","status","msg","tx_hash","created_at","updated_at"],"orders":[[15629,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d107f7e","SNT","KNC",15.0,0.0644,0.0046,0,"cancelled",[],null,1561362335,1561362369],[15624,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d1070fc","WETH","TUSD",0.5,368.9053,0.0045,0,"open",[],null,1561358597,1561358597],[6787,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca5b6","OMG","KNC",1.6835,7.4,0.004,0,"open","hello",null,1561109958,1561112985],[6786,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca5b4","OMG","KNC",1.6835,7.4,0.004,0,"open",[],null,1561109945,1561112985],[6785,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4cb","WETH","KNC",1.6835,368.9053,0.004,0,"open",[],null,1561109714,1561112985],[6784,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4ca","WETH","KNC",1.6835,368.9053,0.004,0,"open",[],null,1561109710,1561112985],[6783,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca4bf","WETH","KNC",1.6835,368.9053,0.004,0,"cancelled",[],null,1561109698,1561112985],[5602,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c931d","KNC","WETH",532.05507,0.002605,0.004,0,"cancelled",[],null,1561105205,1561112985],[5601,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c9147","KNC","WETH",1000.0,0.002603,0.0008,0,"cancelled",[],null,1561105190,1561112985],[5600,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c90b8","KNC","WETH",1.0,0.002604,0.004,0,"cancelled",[],null,1561104592,1561112985],[5599,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c8d65","KNC","WETH",1.0,0.002603,0.0046,0,"cancelled",[],null,1561103733,1561112985],[5598,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c8cb7","WETH","KNC",0.001,368.9053,0.0046,0,"cancelled",[],null,1561103695,1561112985],[2219,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c830c","BAT","KNC",3.6694,0.1787,0.0046,0,"cancelled",[],null,1561101382,1561358944],[1405,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c780e","SNT","KNC",15.4323,0.0644,0.0046,0,"cancelled",[],null,1561098275,1561112985],[1404,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c76cb","ZIL","WETH",7.0,0.0001991,0.0046,0,"cancelled",[],null,1561097940,1561112985],[503,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6653","WETH","KNC",0.001,1.4984,0.0046,0,"cancelled",[],null,1561093727,1561112985],[502,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6148","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092435,1561112985],[501,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c613f","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092429,1561112985],[500,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6125","DAI","LINK",1.7526,245.0,0.0046,0,"cancelled",[],null,1561092419,1561112985],[499,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c6111","DAI","LINK",1.7526,244.2423,0.0046,0,"cancelled",[],null,1561092386,1561112985],[495,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0c5382","WETH","KNC",0.45,368.9053,0.0046,0,"cancelled",[],null,1561088948,1561112985],[485,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11b6","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006529,1561112985],[484,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11af","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006521,1561112985],[483,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11ab","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006514,1561112985],[482,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b11a6","DAI","KNC",2.0,0.6214,0.0045,0,"cancelled",[],null,1561006509,1561112985],[481,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b10dd","DAI","KNC",3.0,0.6214,0.0045,0,"cancelled",[],null,1561006331,1561112985],[480,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b0ac2","KNC","WETH",5.0,0.002603,0.0045,0,"cancelled",[],null,1561004873,1561112985],[479,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b0a5d","KNC","WETH",5.0,0.002603,0.0045,0,"cancelled",[],null,1561004740,1561112985],[478,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b06da","KNC","WETH",2.0,0.002603,0.0045,0,"cancelled",[],null,1561004640,1561112985],[477,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0b04be","KNC","WETH",2.0,0.002603,0.0045,0,"cancelled",[],null,1561003769,1561112985],[475,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a2226","ADX","WETH",2.3044,0.001085,0.0045,0,"cancelled",[],null,1560945726,1561112985],[474,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a20f2","BAT","WETH",6.1673,0.0031,0.0045,0,"cancelled",[],null,1560944902,1561112985],[473,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1f68","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944513,1561112985],[472,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1e9a","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944438,1561112985],[471,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1e91","KNC","WETH",2.0,0.0031,0.0045,0,"cancelled",[],null,1560944285,1561112985],[470,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1a7f","KNC","WETH",2.0,0.003,0.0045,0,"cancelled",[],null,1560943413,1561112985],[469,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1975","KNC","WETH",2.0,0.0028,0.0045,0,"cancelled",[],null,1560943082,1561112985],[468,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a196a","KNC","WETH",2.0,0.0028,0.0045,0,"cancelled",[],null,1560942968,1561112985],[467,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a1703","KNC","WETH",2.0,0.0027,0.0045,0,"cancelled",[],null,1560942351,1561112985],[463,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a084c","OMG","WETH",29.0864631302519,0.019928,0.004,0,"cancelled",[],null,1560938574,1561112985],[462,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0a07a3","KNC","WETH",1530.05507992922,0.002604,0.0008,0,"cancelled",[],null,1560938409,1561112985],[458,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09fc7f","KNC","WETH",250.0,0.002604,0.0041,0,"cancelled",[],null,1560935560,1561112985],[455,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e142","KNC","WETH",300.0,0.0027,0.0041,0,"cancelled",[],null,1560928583,1561112985],[454,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e12f","KNC","WETH",300.0,0.0027,0.0041,0,"cancelled",[],null,1560928564,1561112985],[453,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e120","KNC","WETH",200.0,0.0027,0.0041,0,"cancelled",[],null,1560928549,1561112985],[452,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09e0f9","KNC","WETH",200.0,0.0027,0.0041,0,"cancelled",[],null,1560928513,1561112985],[449,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09b6a2","KNC","BAT",3.0,5.3669,0.005,0,"cancelled",[],null,1560917793,1561112985],[448,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d09b560","KNC","WETH",200.0,0.002604,0.005,0,"cancelled",[],null,1560917345,1561112985],[443,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d08ad20","WETH","DAI",1.0,594.0,0.005,0,"cancelled",[],null,1560849757,1561112985],[442,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0888a8","KNC","BAT",2.0,5.3669,0.005,0,"cancelled",[],null,1560840382,1561112985],[424,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0760ac","KNC","BAT",2.0,5.3669,0.005,0,"cancelled",[],null,1560764594,1561112985],[423,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075f19","KNC","WETH",20.0,0.002603,0.005,0,"cancelled",[],null,1560764194,1561112985],[422,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075ef9","DAI","KNC",5.6,0.6214,0.005,0,"cancelled",[],null,1560764157,1561112985],[421,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075dca","KNC","WETH",20.0,0.002603,0.005,0,"cancelled",[],null,1560763867,1561112985],[420,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075cb4","KNC","WETH",200.0,0.002603,0.005,0,"cancelled",[],null,1560763607,1561112985],[419,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07562d","WETH","KNC",0.5,370.0,0.005,0,"cancelled",[],null,1560761924,1561112985],[418,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07527e","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760972,1561112985],[417,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07524a","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760961,1561112985],[416,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075246","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760908,1561112985],[415,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075241","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760904,1561112985],[414,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07523e","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760901,1561112985],[413,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075239","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760895,1561112985],[412,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075233","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760891,1561112985],[411,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075229","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760887,1561112985],[410,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075223","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760874,1561112984],[409,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07521b","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760870,1561112985],[408,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075214","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760864,1561112985],[407,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d07520d","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560760853,1561112985],[406,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d075139","BAT","KNC",8.6156,1.4,0.005,0,"cancelled",[],null,1560760651,1561112985],[405,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d074697","KNC","DAI",200.0,1.545748,0.005,0,"cancelled",[],null,1560757916,1561112984],[404,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0745b0","KNC","DAI",2.0,1.5457,0.005,0,"cancelled",[],null,1560757777,1561112984],[403,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d073f6e","KNC","BAT",200.0,5.3669,0.005,0,"cancelled",[],null,1560756169,1561112984],[402,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d073b63","BAT","KNC",19.461,0.1787,0.005,0,"cancelled",[],null,1560755131,1561112984],[400,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0732a0","WETH","KNC",0.5,368.9053,0.005,0,"cancelled",[],null,1560752812,1561112984],[390,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d037699","WETH","KNC",5.0,368.9053,0.001,1,"filled",[],"0x74e3d692a06dff260c35cf05ab1f5b0f57033c73",1560508058,1561112984],[388,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0372d0","WETH","KNC",0.6,368.9053,0.005,0,"cancelled",[],null,1560507089,1561112984],[387,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d03707e","WETH","KNC",1.0,368.9053,0.005,0,"cancelled",[],null,1560506498,1561112984],[380,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035e27","WETH","KNC",2.1549,368.9053,0.005,0,"invalidated",[],null,1560501893,1561112984],[379,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035c2b","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501298,1561112984],[378,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035ba3","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501158,1561112984],[377,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b2c","WETH","KNC",0.495,368.9053,0.005,0,"cancelled",[],null,1560501054,1561112984],[376,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b22","WETH","KNC",0.495,368.9053,0.005,0,"invalidated",[],null,1560501037,1561112984],[375,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d035b1a","WETH","KNC",0.495,368.9053,0.005,1,"filled",[],"0x74e3d692a06dff260c35cf05ab1f5b0f57033c73",1560501027,1561112984],[368,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.97737138822154,368.9053,0.005,0,"cancelled",[],null,1560497209,1560506686],[367,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.976708140221545,368.9053,0.005,0,"cancelled",[],null,1560496209,1560496369],[366,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",7.13565757132096,373.0,0.001,0,"cancelled",[],null,1560496060,1560496060],[362,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.977812882221545,368.9053,0.005,0,"cancelled",[],null,1560494673,1560495066],[354,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","BAT","APPC",14.5694454533297,0.76814,0.005,0,"cancelled",[],"",1560413760,1560413760],[312,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","SNT","KNC",190.0,0.064407,0.005,0,"cancelled",[],null,1560325241,1560933469],[310,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","WETH",37.0864631302519,0.019928,0.005,0,"cancelled",[],null,1560325049,1560325071],[308,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","WETH",37.0864631302519,0.019928,0.005,0,"cancelled",[],null,1560324921,1560324932],[296,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.6,372.0,0.005,0,"cancelled",[],null,1560250984,1560250984],[295,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",3.0,0.0029,0.005,1,"filled",[],null,1560250897,1560250897],[290,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.0012,370.0,0.005,1,"filled",[],null,1560250316,1560250316],[289,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","OMG",1.0,0.129187,0.005,1,"filled",[],null,1560249412,1560250397],[288,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,1,"filled",[],null,1560249404,1560249404],[287,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,1,"filled",[],null,1560249281,1560249286],[286,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","KNC","WETH",1.0,0.002604,0.005,0,"open",[],null,1560249263,1560249263],[285,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.0015,368.9053,0.005,0,"open",[],null,1560249233,1560506868],[270,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","OMG","KNC",1.0,7.351693,0.005,0,"open",[],null,1560243814,1560933469],[267,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",0.5,368.9053,0.005,0,"open",[],null,1560243135,1560243578],[266,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.0,368.9053,0.005,0,"open",[],null,1560243101,1560497179],[265,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef7200000000000000000000000000000000","WETH","KNC",1.0,368.9053,0.005,0,"open",[],null,1560243021,1560506858]]}`

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

export function getOrdersByFilter(address = null, pair = null, status = null, time = null, dateSort = "desc", pageIndex = 1, pageSize = LIMIT_ORDER_CONFIG.pageSize) {
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
        newOrder.fee = converters.toT(order.fee, 2) / 100;
        newOrder.min_rate = converters.toT(order.min_rate, 18);
        newOrder.source = sourceTokenSymbol;
        newOrder.dest = destTokenSymbol;
        newOrder.receive = 100;
        newOrder.side_trade = "buy"
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
  return `{"ADX_ETH" : {
    "id": "ADX_ETH",
    "base": "ADX",
    "quote": "ETH",
    "volume": "${Math.ceil(Math.random() *10)}",
    "change": "${Math.ceil(Math.random() *10) -5}"}
  }`
}

export function getVolumeAndChange(){
  return new Promise((resolve, rejected) => {       
      resolve(JSON.parse(getvolumeAndChangeDumpData()));
      return;
  })
}

export function getFavoritePairs(){
  return new Promise((resolve, rejected) => {
    resolve([{base: "BITX", quote: "ETH"}])
  })
}


export function updateFavoritePairs(base, quote, to_fav){
  return new Promise((resolve, rejected) => {
    resolve("")
  })
}

