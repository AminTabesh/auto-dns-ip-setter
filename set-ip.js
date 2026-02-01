const readline = require("readline");

const JIMSPEED_API =
  "https://jimspeed.com/wp-json/jimspeed/v1/portal/subscriptions/slots/set-ip";
const JIMSPEED_CODE = "KYNASYCMNW2MCRE";
const JIMSPEED_SLOT = 1;

const FIREOPS_API =
  "https://ipchecker02.fireops.io:8003/api/web/core/client-ip/automatic-health-check/get/";
let FIREOPS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwMDM3NDE3LCJpYXQiOjE3Njk0MzI2MTcsImp0aSI6IjE0Zjc2ZmY1ODlhYjQyYjlhZGIxNzE5MDZmODkyNjVmIiwidXNlcl9pZCI6IjQ2ZmMzODAwLTVkNmYtNGRjYS1iZjIwLTI2NGFhYjIwYWEzNiJ9.D4Y7hc5mSu_lLCLej9K5WVa8byy7rT9YMmNYbflZKx0";

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
  if (key.name === "escape") {
    logInfo("🛑 ESC pressed. Exiting...");
    process.exit(0);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function logInfo(msg) {
  console.log(`${colors.cyan}${msg}${colors.reset}`);
}

function logSuccess(msg) {
  console.log(`${colors.green}${msg}${colors.reset}`);
}

function logWarn(msg) {
  console.log(`${colors.yellow}${msg}${colors.reset}`);
}

function logError(msg) {
  console.log(`${colors.red}${msg}${colors.reset}`);
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.bright}${question}${colors.reset} `, (answer) =>
      resolve(answer.trim())
    );
  });
}

async function getPublicIP() {
  logInfo("🌐 Getting public IP...");
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error("Failed to get public IP");
  const data = await res.json();
  logSuccess(`Your public IP is: ${data.ip}`);
  return data.ip;
}

async function getCountryCode() {
  logInfo("🗺 Detecting country...");
  try {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) throw new Error("Country lookup failed");
    const data = await res.json();
    if (data && data.country_code) {
      logSuccess(`Country detected: ${data.country_code}`);
      return data.country_code;
    }
    logWarn("No country code returned — using fallback IR");
    return "IR";
  } catch {
    logWarn("Country detection failed — defaulting to IR");
    return "IR";
  }
}

async function runJimSpeed() {
  const ip = await getPublicIP();
  logInfo("📡 Sending request to JIM SPEED...");
  const res = await fetch(JIMSPEED_API, {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json",
      origin: "https://ippanel.jimspeed.com",
      referer: "https://ippanel.jimspeed.com/",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    },
    body: JSON.stringify({
      code: JIMSPEED_CODE,
      slot: JIMSPEED_SLOT,
      ip,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  logSuccess("JIM SPEED request successful!");
  logInfo(`Response: ${text}`);
}

async function runFireOps() {
  const country = await getCountryCode();
  while (true) {
    logInfo(`🚀 Sending request to FIREOPS for country: ${country}...`);
    const url = `${FIREOPS_API}?country=${country}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `jwt ${FIREOPS_JWT}`,
        origin: "https://panel.fireops.io",
        referer: "https://panel.fireops.io/",
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) " +
          "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
      },
    });
    const text = await res.text();
    if (res.status === 401 || text.toLowerCase().includes("token")) {
      logWarn("JWT token invalid or expired.");
      FIREOPS_JWT = await ask("🔑 Please enter a new JWT token:");
      continue;
    }
    if (!res.ok) throw new Error(text);
    logSuccess("FIREOPS request successful!");
    logInfo(`Response: ${text}`);
    break;
  }
}

function showMenu() {
  console.log(`\n${colors.magenta}======================${colors.reset}`);
  console.log(`${colors.bright}🎯 Choose an option:${colors.reset}`);
  console.log(`${colors.cyan}1. JIM SPEED${colors.reset}`);
  console.log(`${colors.cyan}2. FIREOPS${colors.reset}`);
  console.log(`${colors.magenta}======================${colors.reset}`);
  console.log(`${colors.yellow}Press ESC anytime to exit${colors.reset}`);
}

async function handleChoice(choice) {
  try {
    if (choice === "1") {
      await runJimSpeed();
    } else if (choice === "2") {
      await runFireOps();
    } else {
      logWarn("Invalid choice. Please type 1 or 2.");
    }
  } catch (err) {
    logError(`ERROR: ${err.message}`);
  }
  showMenu();
  ask("Enter your choice (1 or 2):").then(handleChoice);
}

logInfo("🎉 Application started!");
showMenu();
ask("Enter your choice (1 or 2):").then(handleChoice);
