export interface NodeInfoGet {
  node: number;
  devtype: string; // e.g. BOX
  subtype: number;
  netw: string;
  addr: number;
  sub: number;
  prnt: number;
  asso: number;
  location: string;
  state: string;
  cntdwn: number;
  endtime: number;
  mode: string;
  trgt: number;
  actl: number;
  ovrl: number;
  snsr: number;
  cerr: number;
  swversion: string;
  serialnb: string;
  temp: number;
  co2: number;
  rh: number;
  error: string;
  show: number;
  link: number;
};