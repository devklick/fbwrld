import { handler } from './index';

handler({
  'detail-type': 'PollFeed',
  account: 'local-account',
  detail: {},
  id: 'local-id',
  region: 'local-region',
  resources: [],
  source: 'local-source',
  time: new Date().toString(),
  version: '1',
});
