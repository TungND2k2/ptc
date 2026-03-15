import { Default_Controllers } from './default';
import { Balance_Controllers } from './balance';
import { Billing_Controllers } from './billing';
import { Billing_v2_Controllers } from './billing-v2';
import { BPO_Controllers } from './bpo';
import { BSM_Controllers } from './bsm';
import { CVB_Controllers } from './cvb';
import { LCM_Controllers } from './lcm';
import { LSM_Controllers } from './lsm';
import { LXM_Controllers } from './lxm';
import { OFM_Controllers } from './ofm';
import { Other_Controllers } from './other';
import { Storage_Controllers } from './storage';
import { Voice_Controllers } from './voice';
import { CSM_Controllers } from './csm';
import { Sample_Controllers } from './sample';
import { PCM_Controllers } from './pcm';
import { SSM_Controllers } from './ssm';
import { Odm_Controllers } from './odoo';
import { Ram_Controllers } from './ram';
import { APM_Controllers } from './apm';
import { Docx_Controllers } from './docx';
import { Iam_Controllers } from './iam';
import { Bpm_Controllers } from './bpm';
import { RSM_Controllers } from './rsm';
import { Sales_Controllers } from './sales';
import { Pricing_Controllers } from './pricing';
import { APIX_Controllers } from './apix';
import { SLM_Controllers } from './ekyc';
import { WB3_Controllers } from './wb3';
import { MAM_Controllers } from './man';
import { NOM_Controllers } from './nom';
import { VCM_Controllers } from './vcm';
import { PTC_Controllers } from './ptc';

export const Controllers = Object.freeze({
  ...Default_Controllers,
  ...Balance_Controllers,
  ...Billing_Controllers,
  ...Billing_v2_Controllers,
  ...BPO_Controllers,
  ...BSM_Controllers,
  ...CVB_Controllers,
  ...LCM_Controllers,
  ...LSM_Controllers,
  ...LXM_Controllers,
  ...OFM_Controllers,
  ...Other_Controllers,
  ...Storage_Controllers,
  ...Voice_Controllers,
  ...CSM_Controllers,
  ...Sample_Controllers,
  ...PCM_Controllers,
  ...SSM_Controllers,
  ...Odm_Controllers,
  ...Ram_Controllers,
  ...APM_Controllers,
  ...Docx_Controllers,
  ...Iam_Controllers,
  ...Bpm_Controllers,
  ...RSM_Controllers,
  ...Sales_Controllers,
  ...Pricing_Controllers,
  ...APIX_Controllers,
  ...SLM_Controllers,
  ...WB3_Controllers,
  ...MAM_Controllers,
  ...NOM_Controllers,
  ...VCM_Controllers,
  ...PTC_Controllers,
});
