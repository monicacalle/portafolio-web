import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  console.log("Navigating to URL...");
  await page.goto('https://selvatica-sigma.vercel.app/', { waitUntil: 'networkidle2' });
  console.log("Taking screenshot...");
  await page.screenshot({ path: '/Users/monicacalle/Desktop/portafolio-web/public/images/selvatica.png' });
  await browser.close();
  console.log("Screenshot saved!");
})();
