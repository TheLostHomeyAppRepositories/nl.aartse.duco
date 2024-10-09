'use strict';

import Homey from 'homey/lib/Homey';
import DucoApi from './api/DucoApi';
import NodeInterface from './types/NodeInterface';
import NodeHelper from './NodeHelper';
import DucoDriver from './homey/DucoDriver';
import { Driver } from 'homey';
import { Device } from 'homey/lib/FlowCardTriggerDevice';

export default class UpdateListener {

    refreshInterval: number = 60000
    ducoApi: DucoApi
    homey: Homey
    timeoutId: any

    constructor(homey: Homey) {
        this.ducoApi = new DucoApi(homey);
        this.homey = homey;
        this.timeoutId = null;

        const timeoutCallback = () => {
            this.startListener();
        }

        const onSettingsChange = (field: any) => {
            if ('hostname' === field) {
                // restart listener with a timeout to make sure the hostname is changed
                this.homey.setTimeout(timeoutCallback, 1000);
            }
        }

        this.homey.settings.on('set', onSettingsChange);
    }

    startListener() {
        // stop the listener interval
        if (this.timeoutId) {
            this.homey.clearInterval(this.timeoutId);
            this.timeoutId = null;
        }

        // use polling to update the data
        const timeoutCallback = () => {
            this.updateDevices();
        }
        this.timeoutId = this.homey.setInterval(timeoutCallback, this.refreshInterval);

        // update devices when start listener
        this.updateDevices();
    }

    updateDevices() {
        this.ducoApi.getNodes().then(nodes => {
            nodes.forEach((node: NodeInterface) => {
                this.updateDriverByNode(node);
            });
        }).catch((err) => {
            const drivers = this.homey.drivers.getDrivers();
            for(const id in drivers) {
                const driver = <DucoDriver>drivers[id];

                driver.setUnavailable(err);
            }
        });
    }

    updateDriverByNode(node: NodeInterface) {
        NodeHelper.getDriverIdsForNodeType(node.General.Type.Val).forEach((driverId: string) => {
            const driver = <DucoDriver>this.homey.drivers.getDriver(driverId);
            
            driver.setAvailable();
            driver.updateByNode(node);
        })
    }
}