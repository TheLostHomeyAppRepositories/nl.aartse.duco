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

    this.registerCapabilityListener('ventilation_state', (value) => {
      return this.ducoApi.postNodeAction(this.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: value
      });
    });
  }

  updateByNode(node: NodeInterface): void {
    this.setCapabilityValue('ventilation_state', node.Ventilation.State.Val);
    this.setCapabilityValue('ventilation_time_state_remain', node.Ventilation.TimeStateRemain.Val);
    this.setCapabilityValue('ventilation_time_state_end', node.Ventilation.TimeStateEnd.Val);
    this.setCapabilityValue('ventilation_mode', node.Ventilation.Mode.Val);
    this.setCapabilityValue('ventilation_flow_level_target', node.Ventilation.FlowLvlTgt.Val);
    this.setCapabilityValue('sensor_air_quality_rh', node.Sensor.IaqRh.Val);
  }
}

module.exports = DucoboxSilentConnectDevice;
