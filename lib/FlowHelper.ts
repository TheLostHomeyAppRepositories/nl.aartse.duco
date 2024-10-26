'use strict';

import DucoDevice from "./homey/DucoDevice";

export default class FlowHelper
{
    static triggerChangedValueFlowCards(device: DucoDevice, oldValue: any, newValue: any, triggerCard: string) : void
    {
        if (newValue !== oldValue) {
            device.homey.log(`trigger ${triggerCard}; old value: "${oldValue}"; new value: "${newValue}"`);

            device.homey.flow.getDeviceTriggerCard(triggerCard)
            .trigger(
                device,
                {
                  old_value: oldValue,
                  new_value: newValue
                },
                {}
            )
            .catch((err) => {
                device.homey.error(err);
            });
        }
      }
}