'use strict';

import Homey from 'homey/lib/Homey';
import DucoApi from './types/DucoApi';
import DucoCommunicationPrintApi from './DucoCommunicationPrintApi';
import DucoConnectivityBoardApi from './DucoConnectivityBoardApi';

let ducoApi: DucoApi|null = null;

export default class DucoApiFactory {
    static create(homey: Homey): DucoApi {
      if (!ducoApi) {
        const apiType = homey.settings.get('apiType');

        homey.log('using API "'+apiType+'"');

        ducoApi = 'communication_print' === apiType
          ? new DucoCommunicationPrintApi(homey)
          : new DucoConnectivityBoardApi(homey);
      }

      return ducoApi;
    }

    static destroy() {
      if (ducoApi) {
        ducoApi.destroy();
      }
      ducoApi = null;
    }
}
