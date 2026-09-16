const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to Vercel Admin...');
  await page.goto('https://quiz-ccp-seven.vercel.app/admin/login');

  console.log('Logging in...');
  await page.fill('input[type="password"]', 'sayantan123');
  await page.click('button:has-text("Enter Portal")');

  // Wait for dashboard to load
  await page.waitForSelector('text=System Overview');

  console.log('Switching to Question Bank tab...');
  // Click the Question Bank tab (Database icon)
  await page.click('button:has-text("Question Bank")');
  
  // Wait for the JSON upload UI to appear
  await page.waitForSelector('text=Bulk Import via JSON');

  const files = [
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_01.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_02.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_03.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_04.json'
  ];

  // Accept dialogs (alerts) automatically
  page.on('dialog', async dialog => {
    console.log(`Alert from page: ${dialog.message()}`);
    await dialog.accept();
  });

  for (const file of files) {
    console.log(`Uploading ${path.basename(file)}...`);
    // Wait for the input to be ready
    const input = await page.$('input#jsonUpload');
    if (input) {
      await input.setInputFiles(file);
      // Wait a few seconds for the upload to process and alert to fire
      await page.waitForTimeout(5000);
    }
  }

  console.log('Done uploading all 4 sets!');
  
  await browser.close();
}

main().catch(console.error);
