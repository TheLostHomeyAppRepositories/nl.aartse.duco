import DucoDevice from '../../lib/homey/DucoDevice';
import NodeInterface from '../../lib/api/types/NodeInterface';
import DucoApi from '../../lib/api/DucoApi';
import NodeActionEnum from '../../lib/api/types/NodeActionEnum';
import DucoBoxCapabilityValues from '../../lib/types/DucoBoxCapabilityValues';
import FlowHelper from '../../lib/FlowHelper';
import UpdateListener from '../../lib/UpdateListner';

class DucoboxFocusDevice extends DucoDevice {
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
    if (!this.hasCapability('measure_ventilation_flow_level_target')) {
      await this.addCapability('measure_ventilation_flow_level_target');
    }

    this.registerCapabilityListener('ventilation_state', (value) => {
      this.homey.log(`ventilation_state capability has been changed to ${value}`);

      return this.ducoApi.postNodeAction(this.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: value
      }).then(() => {
        // trigger event ventilation_state_changed to update the widget data
        this.homey.api.realtime('ventilation_state_changed', {
          old_value: this.getCapabilityValue('ventilation_state'),
          new_value: value,
        });

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
    }

    Promise.all([
      this.setCapabilityValue('ventilation_state', (node.Ventilation && node.Ventilation.State) ? node.Ventilation.State.Val : null),
      this.setCapabilityValue('ventilation_time_state_remain', (node.Ventilation && node.Ventilation.TimeStateRemain) ? node.Ventilation.TimeStateRemain.Val : null),
      this.setCapabilityValue('ventilation_time_state_end', (node.Ventilation && node.Ventilation.TimeStateEnd && node.Ventilation.TimeStateEnd.Val) ? (new Date(node.Ventilation.TimeStateEnd.Val * 1000)).toLocaleString(this.homey.i18n.getLanguage(), { timeZone: this.homey.clock.getTimezone() }) : null),
      this.setCapabilityValue('ventilation_mode', (node.Ventilation && node.Ventilation.Mode) ? node.Ventilation.Mode.Val : null),
      this.setCapabilityValue('ventilation_flow_level_target', (node.Ventilation && node.Ventilation.FlowLvlTgt) ? node.Ventilation.FlowLvlTgt.Val : null),
      this.setCapabilityValue('measure_ventilation_flow_level_target', (node.Ventilation && node.Ventilation.FlowLvlTgt) ? node.Ventilation.FlowLvlTgt.Val : null)
    ]).then(() => {
      this.triggerFlowCards(oldCapabilityValues)
    }).catch((err) => {
      this.homey.log(err)
      throw err
    })
  }

  triggerFlowCards(oldCapabilityValues: DucoBoxCapabilityValues): void {

    // trigger event ventilation_state_changed to update the widget data
    if (oldCapabilityValues.ventilationState !== this.getCapabilityValue('ventilation_state')) {
      this.homey.api.realtime('ventilation_state_changed', {
        old_value: oldCapabilityValues.ventilationState,
        new_value: this.getCapabilityValue('ventilation_state'),
      });
    }

    // trigger ventilation_state changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationState,
      ''+this.getCapabilityValue('ventilation_state'),
      'ducobox-focus__ventilation_state_changed'
    );

    // trigger ventilation_time_state_remain changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.ventilationTimeStateRemain || 0,
      this.getCapabilityValue('ventilation_time_state_remain') || 0,
      'ducobox-focus__ventilation_time_state_remain_changed'
    );

    // trigger ventilation_time_state_end changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationTimeStateEnd,
      ''+this.getCapabilityValue('ventilation_time_state_end'),
      'ducobox-focus__ventilation_time_state_end_changed'
    );

    // trigger ventilation_mode changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      ''+oldCapabilityValues.ventilationMode,
      ''+this.getCapabilityValue('ventilation_mode'),
      'ducobox-focus__ventilation_mode_changed'
    );

    // trigger ventilation_flow_level_target changed
    FlowHelper.triggerChangedValueFlowCards(
      this,
      oldCapabilityValues.ventilationFlowLevelTarget || 0,
      this.getCapabilityValue('ventilation_flow_level_target') || 0,
      'ducobox-focus__ventilation_flow_level_target_changed'
    );
  }
}

module.exports = DucoboxFocusDevice;
