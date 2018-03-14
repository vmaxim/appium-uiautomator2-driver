import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { APIDEMOS_CAPS } from '../../desired';
import { initDriver } from '../../helpers/session';


chai.should();
chai.use(chaiAsPromised);

const caps = _.defaults({
  appPackage: 'io.appium.android.apis',
  appActivity: '.view.WebView1',
  showChromedriverLog: true,
}, APIDEMOS_CAPS);
const WEBVIEW = 'WEBVIEW_io.appium.android.apis';

describe('apidemo - webview', function () {
  let driver;
  before(async function () {
    driver = await initDriver(caps);
  });
  after(async function () {
    await driver.quit();
  });
  it('should be able to get page title', async function () {
    // TODO: Fix this on TestObject. Chromedriver does not exist error
    if (process.env.TESTOBJECT_E2E_TESTS) {
      this.skip();
    }
    await driver.context(WEBVIEW);
    await driver.getTitle().should.eventually.become('I am a page title');
    
  });
});
