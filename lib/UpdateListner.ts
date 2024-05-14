'use strict';

import Homey from 'homey/lib/Homey';
import DucoApi from './api/DucoApi';
import NodeInterface from './types/NodeInterface';
import NodeHelper from './NodeHelper';
import DucoDriver from './homey/DucoDriver';

export default class UpdateListener {

    refreshInterval: number = 60000
    ducoApi: DucoApi
    homey: Homey

    constructor(homey: Homey) {
        this.ducoApi = new DucoApi(homey);
        this.homey = homey;
    }

    startListener() {
        const timeoutCallback = () => {
            this.updateDevices();
        }

        this.homey.setTimeout(timeoutCallback, this.refreshInterval);
    }

    updateDevices() {
        this.ducoApi.getNodes().then(nodes => {
            nodes.forEach((node: NodeInterface) => {
                this.updateDeviceByNode(node);
            });

            this.startListener();
        }).catch(() => {
            this.startListener();
        });
    }

    updateDeviceByNode(node: NodeInterface) {
        NodeHelper.getDriverIdsForNodeType(node.General.Type.Val).forEach((driverId: string) => {
            const driver = this.homey.drivers.getDriver(driverId);
            (<DucoDriver>driver).updateByNode(node);
        })
    }
}