const fs = require("fs");
const axios = require("axios");
const log = console.log;

var tocheck_usernames = [];

let files = fs.readdirSync("wordlists");

for (let i = 0; i < files.length; i++) {
  if (files[i].endsWith(".txt")) {
    let names = fs
      .readFileSync("wordlists/" + files[i], "utf8")
      .split(/\r?\n|\r/);
    for (let k = 0; k < names.length; k++) {
      tocheck_usernames.push(names[k]);
    }
  }
}

var skip = ["available_usernames.txt", "unavailable_usernames.txt"];
var unclaimed = [];
var skipped = 0;

for (let i = 0; i < skip.length; i++) {
  let selected_table = fs.readFileSync(skip[i], "utf8").split(/\r?\n|\r/);
  for (let index = 0; index < selected_table.length; index++) {
    let found = tocheck_usernames.indexOf(selected_table[index]);
    if (found > -1) {
      tocheck_usernames.splice(found, 1);
      skipped++;
    }
  }
}

let start = 0;
let limit = tocheck_usernames.length;
log(
  `Scanning VRChat for ${
    limit - start
  } usernames, skipped ${skipped} usernames.`
);

// Retry logic with exponential backoff for handling rate-limiting
async function fetchWithRetry(options, attempt = 1) {
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const delay = Math.pow(2, attempt) * 10;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(options, attempt + 1); // Retry after delay
    } else {
      throw error; // Throw other errors
    }
  }
}

async function execute() {
  let time_start = Math.floor(new Date().getTime() / 1000);

  for (let index = start; index < start + limit; index++) {
    let selected_username = tocheck_usernames[index].trim();
    let url = `https://vrchat.com/api/1/auth/exists?username=${selected_username}&displayName=${selected_username}`;
    let options = {
      url: url,
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" },
    };

    try {
      if (selected_username.length > 3) {
        const api_response = await fetchWithRetry(options);

        if (api_response.userExists === false && api_response.nameOk === true) {
          fs.appendFile(
            "available_usernames.txt",
            selected_username + "\n",
            (err) => {}
          );
          unclaimed.push(selected_username);
        } else if (
          api_response.userExists === true ||
          api_response.nameOk === false
        ) {
          fs.appendFile(
            "unavailable_usernames.txt",
            selected_username + "\n",
            (err) => {}
          );
        } else {
          log(
            `Unknown response for ${selected_username}: ${JSON.stringify(
              api_response
            )}`
          );
        }
      }
      if (index % 10 == 0 && index > 0) {
        let time_now = Math.floor(new Date().getTime() / 1000);
        let time_remaining =
          ((time_now - time_start) / index) * (limit - index);
        let hours = Math.floor(time_remaining / 60 / 60).toString();
        let minutes = Math.floor((time_remaining / 60) % 60).toString();
        let seconds = Math.floor(time_remaining % 60).toString();
        if (hours.length == 1) hours = "0" + hours;
        if (minutes.length == 1) minutes = "0" + minutes;
        if (seconds.length == 1) seconds = "0" + seconds;
        log(
          `Progress: ${((index / limit) * 100).toFixed(
            2
          )}% (${index} out of ${limit} usernames)\nTime remaining: ${hours}:${minutes}:${seconds}`
        );
      }
    } catch (error) {
      log(`Error checking username ${selected_username}: ${error.message}`);
    }
  }

  log(
    `Done, ${unclaimed.length} of ${tocheck_usernames.length} usernames are available. See available_usernames.txt for more info.`
  );
}

execute();
