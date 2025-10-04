'use strict';

import Homey, { Device } from 'homey';
import UpdateListener from './lib/UpdateListner';
import NodeHelper from './lib/NodeHelper';
import DiscoveryService from './lib/DiscoveryService';
import DucoApiFactory from './lib/api/DucoApiFactory';
import DucoApi from './lib/api/types/DucoApi';

export default class DucoApp extends Homey.App {
  ducoApi!: DucoApi

  async onInit() {
    // init settings
    if (this.homey.settings.get('apiType') === null) {
      this.homey.settings.set('apiType', 'connectivity_board');
    }
    if (this.homey.settings.get('hostname') === null) {
      this.homey.settings.set('hostname', '');
    }
    if (this.homey.settings.get('useHttps') === null) {
      this.homey.settings.set('useHttps', true);
    }

    // init duco API
    this.ducoApi = DucoApiFactory.create(this.homey);

    // reinit duco API when api type in settings is changed
    const onSettingsChange = (field: any) => {
        if ('apiType' === field) {
            this.homey.log('apiType changed, reloading API');

            DucoApiFactory.destroy();
            this.ducoApi = DucoApiFactory.create(this.homey);
        }
    }
    this.homey.settings.on('set', onSettingsChange);

    const updateListner = UpdateListener.create(this.homey);
    updateListner.startListener();

    DiscoveryService.create(this.homey).discover();
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

  getDeviceById(deviceId: string): Device|null {
    const drivers = this.homey.drivers.getDrivers();
    for(const id in drivers) {
      const devices = drivers[id].getDevices();
      for(const id in devices) {
        if (deviceId === devices[id].getAppId()) {
          return devices[id];
        }
      }
    }

    return null;
  }
}

module.exports = DucoApp;
