import NodeHelper from '../../lib/NodeHelper';
import DucoDriver from '../../lib/homey/DucoDriver';
import DucoApiFactory from '../../lib/api/DucoApiFactory';

class HumidityBoxSensorDriver extends DucoDriver {
  async onPairListDevices() {
    // get nodes and filter the nodes that can be handled by this driver
    const nodes = (await DucoApiFactory.create(this.homey).getNodes()).filter(node => NodeHelper.isMappedForDriver(node.General.Type.Val, 'humidity-box-sensor'));

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

module.exports = HumidityBoxSensorDriver;
