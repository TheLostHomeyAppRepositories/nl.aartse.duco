import DucoApi from '../../lib/api/DucoApi';
import NodeHelper from '../../lib/NodeHelper';
import DucoDriver from '../../lib/homey/DucoDriver';
import UpdateListener from '../../lib/UpdateListner';
import NodeActionEnum from '../../lib/api/types/NodeActionEnum';

class DucoboxSilentConnectDriver extends DucoDriver {
  ducoApi!: DucoApi

  async onInit() {
    this.ducoApi = DucoApi.create(this.homey);

    // init action card
    const changeVentilationStateAction = this.homey.flow.getActionCard('ducobox-silent-connect__change_ventilation_state');
    changeVentilationStateAction.registerRunListener((args, state) => {
      return this.ducoApi.postNodeAction(args.device.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: args.ventilation_state
      }).then(() => {
        // restart listener with a timeout to make sure the has updated the values
        UpdateListener.create(this.homey).startListener(10000);
      });
    });
  }

  async onPairListDevices() {
    // get nodes and filter the nodes that can be handled by this driver
    const nodes = (await this.ducoApi.getNodes()).filter(node => NodeHelper.isMappedForDriver(node.General.Type.Val, 'ducobox-silent-connect'));

    // convert each node to a homey device
    return nodes.map(node => {
      return {
        name: node.General.Name.Val || 'Node ' + node.Node,
        data: {
          id: node.Node
        }
      }
    });
  }
}

module.exports = DucoboxSilentConnectDriver;
