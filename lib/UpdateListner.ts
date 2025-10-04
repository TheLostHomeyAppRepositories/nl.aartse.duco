'use strict';

import Homey from 'homey/lib/Homey';
import DucoApi from './api/types/DucoApi';
import NodeInterface from './api/types/NodeInterface';
import NodeHelper from './NodeHelper';
import DucoDriver from './homey/DucoDriver';
import DucoApiFactory from './api/DucoApiFactory';

let updateListener: UpdateListener|null = null;

export default class UpdateListener {

    refreshInterval: number = 60000
    ducoApi: DucoApi
    homey: Homey
    timeoutId: any
    initTimeoutId: any
    updatingDevices: boolean

    constructor(homey: Homey) {
        this.ducoApi = DucoApiFactory.create(homey);
        this.homey = homey;
        this.timeoutId = null;
        this.updatingDevices = false;

        const onSettingsChange = (field: any) => {
            if ('hostname' === field) {
                // restart listener with a timeout to make sure the hostname is changed
                this.startListener(1000);
            }
        }

        this.homey.settings.on('set', onSettingsChange);
    }

    static create(homey: Homey) {
        if (null === updateListener) {
            updateListener = new UpdateListener(homey);
        }

        return updateListener;
    }

    startListener(initTimeout: number|null = null) {
        // stop the listener interval
        if (this.timeoutId) {
            this.homey.clearInterval(this.timeoutId);
            this.timeoutId = null;
        }

        // stop the init timeout interval
        if (this.initTimeoutId) {
            this.homey.clearTimeout(this.initTimeoutId);
            this.initTimeoutId = null;
        }

        // use polling to update the data
        const timeoutCallback = () => {
            this.updateDevices();
        }
        this.timeoutId = this.homey.setInterval(timeoutCallback, this.refreshInterval);

        // update devices when start listener
        if (initTimeout) {
            const timeoutCallback = () => {
                this.updateDevices();
            }

            this.initTimeoutId = this.homey.setTimeout(timeoutCallback, initTimeout);
        } else {
            this.updateDevices();
        }
    }

    updateDevices() {
        if (this.updatingDevices) {
            this.homey.error('update devices process already running');
            return;
        }
        this.updatingDevices = true;

        this.ducoApi.getNodes().then(nodes => {
            this.updatingDevices = false;

            nodes.forEach((node: NodeInterface) => {
                this.updateDriverByNode(node);
            });
        }).catch((err) => {
            this.updatingDevices = false;

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