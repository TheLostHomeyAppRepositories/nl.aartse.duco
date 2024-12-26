import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/api/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';
import DucoBoxCapabilityValues from '../../lib/types/DucoBoxCapabilityValues';
import FlowHelper from '../../lib/FlowHelper';

class CO2BoxSensorDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = DucoApi.create(this.homey);
  }

  async initCapabilities() {
    if (!this.hasCapability('sensor_air_quality_co2')) {
      await this.addCapability('sensor_air_quality_co2');
    }
  }

  updateByNode(node: NodeInterface): void {
    // save old capability values fo tigger cards
    const oldCapabilityValues = <DucoBoxCapabilityValues> {
      sensorAirQualityCO2: this.getCapabilityValue('sensor_air_quality_co2'),
    }

    Promise.all([
      this.setCapabilityValue('sensor_air_quality_co2', (node.Sensor && node.Sensor.IaqCo2) ? node.Sensor.IaqCo2.Val : null)
    ]).then(() => {
      this.triggerFlowCards(oldCapabilityValues)
    }).catch((err) => {
      this.homey.log(err)
      throw err
    })
  }

  triggerFlowCards(oldCapabilityValues: DucoBoxCapabilityValues): void {
    // trigger sensor_air_quality_co2 changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.sensorAirQualityCO2 || 0,
      this.getCapabilityValue('sensor_air_quality_co2'),
      'co2-box-sensor__sensor_air_quality_co2_changed'
    );
  }
}

module.exports = CO2BoxSensorDevice;
