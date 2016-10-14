import { CrossbowUiPage } from './app.po';

describe('crossbow-ui App', function() {
  let page: CrossbowUiPage;

  beforeEach(() => {
    page = new CrossbowUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
