import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/api/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';
import DucoBoxCapabilityValues from '../../lib/types/DucoBoxCapabilityValues';
import FlowHelper from '../../lib/FlowHelper';

class HumidityRoomSensorDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = DucoApi.create(this.homey);
  }

  async initCapabilities() {
    if (!this.hasCapability('sensor_air_quality_rh')) {
      await this.addCapability('sensor_air_quality_rh');
    }
  }

  updateByNode(node: NodeInterface): void {
    // save old capability values fo tigger cards
    const oldCapabilityValues = <DucoBoxCapabilityValues> {
      sensorAirQualityRH: this.getCapabilityValue('sensor_air_quality_rh'),
    }

    Promise.all([
      this.setCapabilityValue('sensor_air_quality_rh', (node.Sensor && node.Sensor.IaqRh) ? node.Sensor.IaqRh.Val : null)
    ]).then(() => {
      this.triggerFlowCards(oldCapabilityValues)
    }).catch((err) => {
      this.homey.log(err)
      throw err
    })
  }

  triggerFlowCards(oldCapabilityValues: DucoBoxCapabilityValues): void {
    // trigger sensor_air_quality_rh changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.sensorAirQualityRH || 0,
      this.getCapabilityValue('sensor_air_quality_rh'),
      'humidity-room-sensor__sensor_air_quality_rh_changed'
    );
  }
}

module.exports = HumidityRoomSensorDevice;
