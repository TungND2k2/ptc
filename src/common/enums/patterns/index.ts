import { Service_Patterns } from './services';
import { Subscription_Patterns } from './subscriptions';
import { Notification_Patterns } from './notifications';
import { User_Patterns } from './users';
import { Payment_Patterns } from './payments';
import { Iam_Patterns } from './iam';
import { Bpm_Patterns } from './bpm';

export const Patterns = Object.freeze({
  ...Service_Patterns,
  ...Subscription_Patterns,
  ...Notification_Patterns,
  ...User_Patterns,
  ...Payment_Patterns,
  ...Iam_Patterns,
  ...Bpm_Patterns,
});
