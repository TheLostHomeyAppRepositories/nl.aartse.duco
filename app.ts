'use strict';

import Homey, { Device } from 'homey';
import UpdateListener from './lib/UpdateListner';
import DucoApi from './lib/api/DucoApi';
import NodeActionEnum from './lib/api/types/NodeActionEnum';
import NodeHelper from './lib/NodeHelper';
import DiscoveryService from './lib/DiscoveryService';

export default class DucoApp extends Homey.App {
  ducoApi!: DucoApi

  async onInit() {
    this.ducoApi = DucoApi.create(this.homey);

    const updateListner = UpdateListener.create(this.homey);
    updateListner.startListener();

    DiscoveryService.create(this.homey).discover();
  }

  updateBoxState(state: string) {
    // get box device
    const boxDevice = this.getBoxDevice();
    if (null === boxDevice) {
      this.homey.error('no box device found');

      return;
    }

    // change box state
    this.ducoApi.postNodeAction(boxDevice.getData().id, {
      Action: NodeActionEnum.SetVentilationState,
      Val: state
    }).then(() => {
      // update capability value and restart listener with a timeout to make sure the has updated the values
      boxDevice.setCapabilityValue('ventilation_state', state);
      UpdateListener.create(this.homey).startListener(10000);
    });
  }

  getBoxState(state: string): string {
    // get box device
    const boxDevice = this.getBoxDevice();
    if (null === boxDevice) {
      this.homey.error('no box device found');

      return '';
    }

    // return ventilation state
    return boxDevice.getCapabilityValue('ventilation_state');
  }

  getBoxDevice(): Device|null {
    const drivers = this.homey.drivers.getDrivers();
    for(const id in drivers) {
      if (NodeHelper.isMappedForDriver('BOX', id)) {
        const devices = drivers[id].getDevices();
        for(const id in devices) {
          return devices[id];
        }
      }
    }

    return null;
  }
}

module.exports = DucoApp;
