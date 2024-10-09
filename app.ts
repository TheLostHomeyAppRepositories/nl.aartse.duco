'use strict';

import Homey from 'homey';
import UpdateListener from './lib/UpdateListner';
import DucoApi from './lib/api/DucoApi';
import NodeActionEnum from './lib/types/NodeActionEnum';

export default class DucoApp extends Homey.App {
  ducoApi!: DucoApi

  async onInit() {
    this.ducoApi = new DucoApi(this.homey);

    const updateListner = new UpdateListener(this.homey);
    updateListner.startListener();

    const changeVentilationStateAction = this.homey.flow.getActionCard('ducobox-silent-connect__change_ventilation_state');
    changeVentilationStateAction.registerRunListener((args, state) => {
      return this.ducoApi.postNodeAction(args.device.getData().id, {
        Action: NodeActionEnum.SetVentilationState,
        Val: args.State
      }).then(() => {
        updateListner.updateDevices();
      });
    });
  }

}

module.exports = DucoApp;
