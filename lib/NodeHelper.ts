'use strict';

export default class NodeHelper {

    static getDriverIdsForNodeType(type: string) : string[] {
        switch (type) {
            case 'BOX':
                return ['ducobox-silent-connect'];
            case 'BSRH':
                return ['humidity-box-sensor'];
            case 'BSCO2':
                return ['co2-box-sensor'];
            case 'UCRH':
                return ['humidity-room-sensor'];
            case 'UCCO2':
                return ['co2-room-sensor'];
        }

        return [];
    }

    static isMappedForDriver(type: string, driver: string) : boolean {
        return this.getDriverIdsForNodeType(type).indexOf(driver) !== -1;
    }
}