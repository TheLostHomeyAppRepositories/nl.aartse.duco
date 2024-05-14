'use strict';

import Homey from 'homey';
import UpdateListener from './lib/UpdateListner';

export default class DucoApp extends Homey.App {
  async onInit() {
    const updateListner = new UpdateListener(this.homey);
    updateListner.startListener();
  }

}

module.exports = DucoApp;
