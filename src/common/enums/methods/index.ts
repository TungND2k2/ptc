import { Billing_Methods } from './billing';
import { Billing_V2_Methods } from './billing-v2';
import { Default_Methods } from './default';
import { Balance_Methods } from './balance';
import { Balance_V2_Methods } from './balance_v2';
import { Sales_Method } from './sales';
export const Methods = Object.freeze({
  ...Default_Methods,
  ...Billing_Methods,
  ...Balance_Methods,
  ...Billing_V2_Methods,
  ...Balance_V2_Methods,
  ...Sales_Method,
});
