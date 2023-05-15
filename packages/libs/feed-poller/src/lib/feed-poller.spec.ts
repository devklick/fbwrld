import { feedPoller } from './feed-poller';

describe('feedPoller', () => {
  it('should work', () => {
    expect(feedPoller()).toEqual('feed-poller');
  });
});
