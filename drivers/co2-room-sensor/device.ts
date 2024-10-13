import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/api/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';

class Co2RoomSensorDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = new DucoApi(this.homey);
  }

  async initCapabilities() {
    if (!this.hasCapability('sensor_air_quality_co2')) {
      await this.addCapability('sensor_air_quality_co2');
    }
  }

  updateByNode(node: NodeInterface): void {
    if (node.Sensor && node.Sensor.IaqCo2) {
      this.setCapabilityValue('sensor_air_quality_co2', node.Sensor.IaqCo2.Val).catch((reason) => this.error(reason));
    }
  }
}

module.exports = Co2RoomSensorDevice;
