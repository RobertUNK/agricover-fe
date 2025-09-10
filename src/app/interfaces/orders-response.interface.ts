export interface OrdersResponse {
  vanzari: Vanzare[];
  achizitii: Achizitie[];
}

export interface Vanzare {
  auart: string;
  audat: string;
  vbeln: string;
  kunnr: string;
  name1: string;
  agent: string;
  timestamp1: number;
  vkbur: string;
  vkburBezei: string;
  status: string;
  motivblocaj: string;
  responsabil: string;
  timestamp2: number;
  autlf: string;
  vdatu: string;
  objnr: string;
  stat: string;
  erdat: string;
  erzet: string;
  pozitii: PozitieVanzare[];
}

export interface PozitieVanzare {
  posnr: number;
  matnr: string;
  arktx: string;
  kwmeng: number;
  vrkme: string;
  werks: string;
  ulstock: number;
}

export interface Achizitie {
  ebeln: string;
  lifnr: string;
  name1: string;
  timestamp1: number;
  aedat: string;
  bedat: string;
  eeind: string;
  status: string;
  motivblocaj: string;
  responsabil: string;
  timestamp2: number;
  pozitii: PozitieAchizitie[];
  ernam: string;
  spart_vtext: string;
  autlf: string;
}

export interface PozitieAchizitie {
  ebelp: string;
  matnr: string;
  txz01: string;
  menge: number;
  bprme: string;
  werks: string;
  bprme_rec: number;
}
