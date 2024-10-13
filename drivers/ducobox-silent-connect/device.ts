import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/api/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';
import NodeActionEnum from '../../lib/api/types/NodeActionEnum';
import DucoBoxCapabilityValues from '../../lib/types/DucoBoxCapabilityValues';
import FlowHelper from '../../lib/FlowHelper';
import UpdateListener from '../../lib/UpdateListner';

class DucoboxSilentConnectDevice extends DucoDevice {
  ducoApi!: DucoApi

  async onInit() {
    await this.initCapabilities();
    this.ducoApi = DucoApi.create(this.homey);
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
      }).then(() => {
        // restart listener with a timeout to make sure the has updated the values
        UpdateListener.create(this.homey).startListener(10000);
      });
    });
  }

  updateByNode(node: NodeInterface): void {
    // save old capability values fo tigger cards
    const oldCapabilityValues = <DucoBoxCapabilityValues> {
      ventilationState: this.getCapabilityValue('ventilation_state'),
      ventilationTimeStateRemain: this.getCapabilityValue('ventilation_time_state_remain'),
      ventilationTimeStateEnd: this.getCapabilityValue('ventilation_time_state_end'),
      ventilationMode: this.getCapabilityValue('ventilation_mode'),
      ventilationFlowLevelTarget: this.getCapabilityValue('ventilation_flow_level_target'),
      sensorAirQualityRH: this.getCapabilityValue('sensor_air_quality_rh'),
      sensorAirQualityCO2: this.getCapabilityValue('sensor_air_quality_co2'),
    }

    Promise.all([
      this.setCapabilityValue('ventilation_state', (node.Ventilation && node.Ventilation.State) ? node.Ventilation.State.Val : null),
      this.setCapabilityValue('ventilation_time_state_remain', (node.Ventilation && node.Ventilation.TimeStateRemain) ? node.Ventilation.TimeStateRemain.Val : null),
      this.setCapabilityValue('ventilation_time_state_end', (node.Ventilation && node.Ventilation.TimeStateEnd && node.Ventilation.TimeStateEnd.Val) ? (new Date(node.Ventilation.TimeStateEnd.Val * 1000)).toLocaleString(this.homey.i18n.getLanguage(), { timeZone: this.homey.clock.getTimezone() }) : null),
      this.setCapabilityValue('ventilation_mode', (node.Ventilation && node.Ventilation.Mode) ? node.Ventilation.Mode.Val : null),
      this.setCapabilityValue('ventilation_flow_level_target', (node.Ventilation && node.Ventilation.FlowLvlTgt) ? node.Ventilation.FlowLvlTgt.Val : null),
      this.setCapabilityValue('sensor_air_quality_rh', (node.Sensor && node.Sensor.IaqRh) ? node.Sensor.IaqRh.Val : null),
      this.setCapabilityValue('sensor_air_quality_co2', (node.Sensor && node.Sensor.IaqCo2) ? node.Sensor.IaqCo2.Val : null)
    ]).then(() => {
      this.triggerFlowCards(oldCapabilityValues)
    }).catch((err) => {
      this.homey.log(err)
      throw err
    })
  }

  triggerFlowCards(oldCapabilityValues: DucoBoxCapabilityValues): void {
    // trigger ventilation_state changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationState,
      ''+this.getCapabilityValue('ventilation_state'),
      'ducobox-silent-connect__ventilation_state_changed'
    );

    // trigger ventilation_time_state_remain changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.ventilationTimeStateRemain,
      this.getCapabilityValue('ventilation_time_state_remain'),
      'ducobox-silent-connect__ventilation_time_state_remain_changed'
    );

    // trigger ventilation_time_state_end changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationTimeStateEnd,
      ''+this.getCapabilityValue('ventilation_time_state_end'),
      'ducobox-silent-connect__ventilation_time_state_end_changed'
    );

    // trigger ventilation_mode changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationMode,
      ''+this.getCapabilityValue('ventilation_mode'),
      'ducobox-silent-connect__ventilation_mode_changed'
    );

    // trigger ventilation_flow_level_target changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.ventilationFlowLevelTarget,
      this.getCapabilityValue('ventilation_flow_level_target'),
      'ducobox-silent-connect__ventilation_flow_level_target_changed'
    );

    // trigger sensor_air_quality_rh changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.sensorAirQualityRH,
      this.getCapabilityValue('sensor_air_quality_rh'),
      'ducobox-silent-connect__sensor_air_quality_rh_changed'
    );

    // trigger sensor_air_quality_co2 changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.sensorAirQualityCO2,
      this.getCapabilityValue('sensor_air_quality_co2'),
      'ducobox-silent-connect__sensor_air_quality_co2_changed'
    );
  }
}

module.exports = DucoboxSilentConnectDevice;
