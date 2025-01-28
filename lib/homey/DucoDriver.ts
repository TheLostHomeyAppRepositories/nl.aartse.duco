import NodeInterface from "../api/types/NodeInterface";
import Homey, { Device } from 'homey';
import DucoDevice from "./DucoDevice";

export default class DucoDriver extends Homey.Driver {
    updateByNode(node: NodeInterface) {
      this.getDevices().forEach((device: Device) => {
        device.setAvailable();
        if (device.getData().id === node.Node) {
          this.homey.log('updating "'+this.id+'" named "'+device.getName()+'" for node "'+node.Node+'"');
          (<DucoDevice>device).updateByNode(node);
        }
      })
    }

    setUnavailable(message?: string | null | undefined) {
      this.getDevices().forEach((device: Device) => {
        device.setUnavailable(message);
      })
    }

    setAvailable() {
      this.getDevices().forEach((device: Device) => {
        device.setAvailable();
      })
    }
}