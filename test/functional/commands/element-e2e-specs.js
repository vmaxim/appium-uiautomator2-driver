import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';
import { APIDEMOS_CAPS } from '../desired';
import { initDriver } from '../helpers/session';


chai.should();
chai.use(chaiAsPromised);

const PACKAGE = APIDEMOS_CAPS.appPackage;
const TEXT_FIELDS_ACTIVITY = '.view.TextFields';
const DATE_WIDGETS_ACTIVITY = '.view.DateWidgets1';
const CUSTOM_PICKER_ACTIVITY ='.view.CustomPicker1';

describe('element', function () {
  let driver;
  before(async () => {
    driver = await initDriver(Object.assign({}, APIDEMOS_CAPS));
  });
  after(async () => {
    await driver.quit();
  });

  describe('setValue', () => {
    it('should set the text on the element', async () => {
      await driver.startActivity({appPackage: PACKAGE, appActivity: TEXT_FIELDS_ACTIVITY});
      let el = _.last(await driver.elementsByClassName('android.widget.EditText'));
      await el.sendKeys('original value');
      await el.text().should.eventually.equal('original value');
    });
    it('should be able to append text', async () => {
      await driver.startActivity({appPackage: PACKAGE, appActivity: TEXT_FIELDS_ACTIVITY});
      let el = _.last(await driver.elementsByClassName('android.widget.EditText'));
      await el.sendKeys('old_value');
      await el.sendKeys('_new_value');
      await el.text().should.eventually.equal('old_value_new_value');
    });
  });
  describe('replaceValue', () => {
    it('should be able to replace text', async () => {
      await driver.startActivity({appPackage: PACKAGE, appActivity: TEXT_FIELDS_ACTIVITY});
      let el = _.last(await driver.elementsByClassName('android.widget.EditText'));
      await el.sendKeys('old_value');
      await el.text().should.eventually.equal('old_value');
      await el.setText('new_value');
      await el.text().should.eventually.equal('new_value');
    });
    it('should be able to set text in picker', async () => {
      await driver.startActivity({appPackage: PACKAGE, appActivity: DATE_WIDGETS_ACTIVITY});
      await (await driver.elementById('io.appium.android.apis:id/pickTimeSpinner')).click();

      let hours = await driver.waitForElementByXPath('//android.widget.NumberPicker[1]//android.widget.EditText');
      await hours.setText('9');
      // Force get focus event
      await hours.click();

      let minutes = await driver.elementByXPath('//android.widget.NumberPicker[2]//android.widget.EditText');
      await minutes.setText('59');
      // Force get focus event
      await minutes.click();

      let pm = await driver.elementByXPath('//*[@text="PM"]');
      await pm.click();

      let okButton = await driver.elementByXPath('//*[@text="OK" or @text="Ok"]');
      await okButton.click();

      let date = await driver.waitForElementById('io.appium.android.apis:id/dateDisplay');
      await date.text().should.eventually.contains('21:59');
    });
    it('should be able to set text in picker with custom displayed values', async () => {
      await driver.startActivity({appPackage: PACKAGE, appActivity: CUSTOM_PICKER_ACTIVITY});
      let picker = await driver.elementByXPath('//android.widget.NumberPicker[1]//android.widget.EditText');

      await picker.setText('kupima');
      // Force get focus event
      await picker.click();

      let textView = await driver.elementById('io.appium.android.apis:id/textView1');
      await textView.text().should.eventually.contains('kupima');
    });
  });
});
