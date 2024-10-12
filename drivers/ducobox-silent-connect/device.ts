import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';
import NodeActionEnum from '../../lib/types/NodeActionEnum';

class DucoboxSilentConnectDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = new DucoApi(this.homey);
  }

  async initCapabilities() {
    if (!this.hasCapability('ventilation_state')) {
      await this.addCapability('ventilation_state');
    }
    if (!this.hasCapability('ventilation_time_state_remain')) {
      await this.addCapability('ventilation_time_state_remain');
    }
    if (!this.hasCapability('ventilation_time_state_end')) {
      await this.addCapability('ventilation_time_state_end');
    }
    if (!this.hasCapability('ventilation_mode')) {
      await this.addCapability('ventilation_mode');
    }
    if (!this.hasCapability('ventilation_flow_level_target')) {
      await this.addCapability('ventilation_flow_level_target');
    }
    if (!this.hasCapability('sensor_air_quality_rh')) {
      await this.addCapability('sensor_air_quality_rh');
    }
    if (!this.hasCapability('sensor_air_quality_co2')) {
      await this.addCapability('sensor_air_quality_co2');
    }

    this.registerCapabilityListener('ventilation_state', (value) => {
      return this.ducoApi.postNodeAction(this.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: value
      });
    });
  }

  updateByNode(node: NodeInterface): void {
    if (node.Ventilation && node.Ventilation.State) {
      this.setCapabilityValue('ventilation_state', node.Ventilation.State.Val).catch((reason) => this.error(reason));
    }

    if (node.Ventilation && node.Ventilation.TimeStateRemain) {
      this.setCapabilityValue('ventilation_time_state_remain', node.Ventilation.TimeStateRemain.Val).catch((reason) => this.error(reason));
    }

    if (node.Ventilation && node.Ventilation.TimeStateEnd) {
      this.setCapabilityValue('ventilation_time_state_end', node.Ventilation.TimeStateEnd.Val).catch((reason) => this.error(reason));
    }

    if (node.Ventilation && node.Ventilation.Mode) {
      this.setCapabilityValue('ventilation_mode', node.Ventilation.Mode.Val).catch((reason) => this.error(reason));
    }

    if (node.Ventilation && node.Ventilation.FlowLvlTgt) {
      this.setCapabilityValue('ventilation_flow_level_target', node.Ventilation.FlowLvlTgt.Val).catch((reason) => this.error(reason));
    }

    if (node.Sensor && node.Sensor.IaqRh) {
      this.setCapabilityValue('sensor_air_quality_rh', node.Sensor.IaqRh.Val).catch((reason) => this.error(reason));
    }

    if (node.Sensor && node.Sensor.IaqCo2) {
      this.setCapabilityValue('sensor_air_quality_co2', node.Sensor.IaqCo2.Val).catch((reason) => this.error(reason));
    }
  }
}

module.exports = DucoboxSilentConnectDevice;
