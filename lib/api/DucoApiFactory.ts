'use strict';

import Homey from 'homey/lib/Homey';
import DucoApi from './types/DucoApi';
import DucoCommunicationPrintApi from './DucoCommunicationPrintApi';
import DucoRestApi from './DucoRestApi';

let ducoApi: DucoApi|null = null;

export default class DucoApiFactory {
    static create(homey: Homey): DucoApi {
      if (!ducoApi) {
        const useCommunicationPrintApi = homey.settings.get('useCommunicationPrintApi');

        ducoApi = useCommunicationPrintApi
          ? new DucoCommunicationPrintApi(homey)
          : new DucoRestApi(homey);
      }

      return ducoApi;
    }
}
