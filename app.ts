'use strict';

import Homey from 'homey';
import UpdateListener from './lib/UpdateListner';
import DucoApi from './lib/api/DucoApi';

export default class DucoApp extends Homey.App {
  ducoApi!: DucoApi

  async onInit() {
    this.ducoApi = DucoApi.create(this.homey);

    const updateListner = UpdateListener.create(this.homey);
    updateListner.startListener();
  }

}

module.exports = DucoApp;
