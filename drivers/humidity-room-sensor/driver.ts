import DucoApi from '../../lib/api/types/DucoApi';
import NodeHelper from '../../lib/NodeHelper';
import DucoDriver from '../../lib/homey/DucoDriver';
import NodeActionEnum from '../../lib/api/types/NodeActionEnum';
import UpdateListener from '../../lib/UpdateListner';
import DucoApiFactory from '../../lib/api/DucoApiFactory';

class HumidityRoomSensorDriver extends DucoDriver {
  ducoApi!: DucoApi

  async onInit() {
    this.ducoApi = DucoApiFactory.create(this.homey);

    // init action card
    const changeVentilationStateAction = this.homey.flow.getActionCard('humidity-room-sensor__change_ventilation_state');
    changeVentilationStateAction.registerRunListener((args, state) => {
      return this.ducoApi.postNodeAction(args.device.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: args.ventilation_state
      }).then(() => {
        // trigger event ventilation_state_changed to update the widget data
        this.homey.api.realtime('ventilation_state_changed', {
          device_id: args.device.getAppId(),
          old_value: args.device.getCapabilityValue('ventilation_state'),
          new_value: args.ventilation_state,
        });

        // update capability value
        args.device.setCapabilityValue('ventilation_state', args.ventilation_state);

        // restart listener with a timeout to make sure the has updated the values
        UpdateListener.create(this.homey).startListener(10000);
      });
    });
    
    // init condition cards
    const ventilationStateCondition = this.homey.flow.getConditionCard('humidity-room-sensor__ventilation_state_is');
    ventilationStateCondition.registerRunListener((args, state) => {
      return args.device.getCapabilityValue('ventilation_state') === args.state;
    });
  }

  async onPairListDevices() {
    // get nodes and filter the nodes that can be handled by this driver
    const nodes = (await this.ducoApi.getNodes()).filter(node => NodeHelper.isMappedForDriver(node.General.Type.Val, 'humidity-room-sensor'));

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

module.exports = HumidityRoomSensorDriver;
