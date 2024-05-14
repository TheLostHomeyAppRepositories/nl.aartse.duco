import NodeInterface from "../types/NodeInterface";
import Homey, { Device } from 'homey';
import DucoDevice from "./DucoDevice";

export default class DucoDriver extends Homey.Driver {
    updateByNode(node: NodeInterface) {
      this.getDevices().forEach((device: Device) => {
        (<DucoDevice>device).updateByNode(node);
      })
    }
}