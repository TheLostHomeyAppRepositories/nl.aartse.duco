import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';

class HumidityRoomSensorDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = new DucoApi(this.homey);
  }

  async initCapabilities() {
    if (!this.hasCapability('sensor_air_quality_rh')) {
      await this.addCapability('sensor_air_quality_rh');
    }
  }

  updateByNode(node: NodeInterface): void {
    if (node.Sensor && node.Sensor.IaqRh) {
      this.setCapabilityValue('sensor_air_quality_rh', node.Sensor.IaqRh.Val).catch((reason) => this.error(reason));
    }
  }
}

module.exports = HumidityRoomSensorDevice;
