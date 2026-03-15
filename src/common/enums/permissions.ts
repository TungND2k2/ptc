import { LXM_Permissions } from './permissions/lxm';
import { Permission } from '../types/data';
import { Default_Permissions } from './permissions/default';
import { OFM_Permissions } from './permissions/ofm';
import { Voice_Permissions } from './permissions/voice';
import { BPO_Permissions } from './permissions/bpo';
import { CSM_Permissions } from './permissions/csm';
import { BSM_Permissions } from './permissions/bsm';
import { LSM_Permissions } from './permissions/lsm';
import { LCM_Permissions } from './permissions/lcm';
import { Other_Permissions } from './permissions/other';
import { Storage_Permissions } from './permissions/storage';
import { CVB_Permissions } from './permissions/cvb';
import { Billing_Permissions } from './permissions/billing';
import { Billing_v2_Permissions } from './permissions/billing-v2';
import { Balance_Permissions } from './permissions/balance';
import { Sample_Permissions } from './permissions/sample';
import { SSM_Permissions } from './permissions/ssm';
import { Odoo_Permissions } from './permissions/odoo';
import { Ram_Permissions } from './permissions/ram';
import { APM_Permissions } from './permissions/apm';
import { Document_Permissions } from './permissions/docx';
import { Bpm_Permission } from './permissions/bpm';
import { PCM_Permissions } from './permissions/pcm';
import { RSM_Permissions } from './permissions/rsm';
import { Sales_Permissions } from './permissions/sales';
import { Pricing_Permissions } from './permissions/pricing';
import { Iam_Permissions } from './permissions/iam';
import { WB3_Permissions } from './permissions/wb3';
import { APIX_Permissions } from './permissions/apix';
import { MAM_Permissions } from './permissions/mam';
import { NOM_Controllers } from './controllers/nom';
import { NOM_Permissions } from './permissions/nom';
import { PTC_Permissions } from './permissions/ptc';

//
export const Permissions: Permission[] = [
  ...Default_Permissions,
  ...Other_Permissions,
  ...Voice_Permissions,
  ...OFM_Permissions,
  ...BPO_Permissions,
  ...LCM_Permissions,
  ...CSM_Permissions,
  ...BSM_Permissions,
  ...LSM_Permissions,
  ...LXM_Permissions,
  ...Storage_Permissions,
  ...CVB_Permissions,
  ...Billing_Permissions,
  ...Billing_v2_Permissions,
  ...Balance_Permissions,
  ...Sample_Permissions,
  ...SSM_Permissions,
  ...Odoo_Permissions,
  ...Ram_Permissions,
  ...APM_Permissions,
  ...Document_Permissions,
  ...Bpm_Permission,
  ...PCM_Permissions,
  ...RSM_Permissions,
  ...Sales_Permissions,
  ...Pricing_Permissions,
  ...Iam_Permissions,
  ...WB3_Permissions,
  ...APIX_Permissions,
  ...MAM_Permissions,
  ...NOM_Permissions,
  ...PTC_Permissions,
];
