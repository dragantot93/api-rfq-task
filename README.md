# Playwright Automation Tests

## What I Used

I built this test suite with Playwright and TypeScript. Playwright is great for both UI and API testing, so I didn't need to bring in extra libraries. TypeScript gives me better autocomplete and helps catch bugs before running tests.

I'm also using dotenv for managing API keys and config stuff, plus Prettier and ESLint to keep the code clean.

## Getting Started

You'll need Node.js installed (version 16 or newer should work fine).

# Install everything
Go into tests folder

npm install

# Download the browsers Playwright needs
npx playwright install

You will need .env file in tests folder so make sure to create one and create API_KEY variable with value of your API key

example - API_KEY=ApiKey you-can-do-it-too

## Running the Tests
Make sure you are in tests folder.

Most of the time you'll probably use:

npm test

This runs everything in headless mode (no browser window).

After tests run, you can check out the HTML report:

npm run test:report

## My Thoughts on the APIs

What worked well:
- Playwright handles waiting and retries automatically, which makes tests way more stable than tools I've used before
- The API testing features are built-in, so I didn't need to add axios or anything else
- TypeScript autocomplete is super helpful when writing tests

Things to watch out for:
- If you're hitting live APIs, you might need to add some delays between tests or the rate limiting could cause failures
- API response times can vary, so I set reasonable timeouts but you might need to adjust them
- Error responses should ideally follow a consistent format - it makes writing assertions much easier

Some ideas for improvement:
- Could add test data factories to generate random test data instead of hardcoding it
- Might be worth setting up GitHub Actions to run these automatically on PRs
- The trace viewer is really helpful for debugging

## If Something Goes Wrong

Tests are flaky or timing out:
- Try increasing the timeout in `playwright.config.ts`
- Check if the API is actually reachable and responding normally
