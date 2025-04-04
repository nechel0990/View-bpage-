const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const blogURL = process.env.BLOG_URL || "https://example.com";
const earningsPath = path.join(__dirname, "../data/earnings.json");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(blogURL, { waitUntil: "networkidle2", timeout: 0 });

  // Simulate scrolling
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await new Promise(r => setTimeout(r, 1000));
  }

  // Find Adsterra ad iframes or containers
  const ads = await page.$$('iframe, .adsterra'); // Adjust as needed

  if (ads.length > 0) {
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    await randomAd.click();
    await new Promise(r => setTimeout(r, 3000)); // simulate stay time
  }

  // Update earnings
  let earnings = { earnings: [], total_clicks: 0, total_earnings_usd: 0.0 };
  if (fs.existsSync(earningsPath)) earnings = JSON.parse(fs.readFileSync(earningsPath));

  const clickValue = +(Math.random() * (0.05 - 0.01) + 0.01).toFixed(4);
  earnings.earnings.push({ timestamp: new Date().toISOString(), click_value_usd: clickValue });
  earnings.total_clicks += 1;
  earnings.total_earnings_usd += clickValue;

  fs.writeFileSync(earningsPath, JSON.stringify(earnings, null, 2));

  await browser.close();
})();