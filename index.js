const fs = require("fs");
const axios = require("axios");
const log = console.log;

const wordlists = fs.readdirSync("wordlists");
const results = fs.readdirSync("results");

var checked = [];
var names = [];
var unclaimed = [];
var skipped = 0;

for (let i = 0; i < results.length; i++) {
  let selected_file = "results/"+results[i];
  let content = fs.readFileSync(selected_file, "utf8").split(/\r?\n|\r/);
  for (let index = 0; index < content.length; index++) {
    let result = content[index].trim();
    checked.push(result);
  }
}

for (let i = 0; i < wordlists.length; i++) {
  let selected_file = wordlists[i];
  if (selected_file.endsWith(".txt")) {
    let content = fs
      .readFileSync("wordlists/" + selected_file, "utf8")
      .split(/\r?\n|\r/);
    for (let k = 0; k < content.length; k++) {
      let result = content[k].trim();
      let found = checked.indexOf(result);
      if (found == -1) {
        names.push(result);
      } else {
        skipped++;
      }
    }
  }
}

let start = 0;
let limit = names.length;

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
    let selected_name = names[index].trim();
    let options = {
      url: `https://vrchat.com/api/1/auth/exists?username=${selected_name}&displayName=${selected_name}`,
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" },
    };

    try {
      if (selected_name.length > 3 && selected_name.length < 16) {
        const api_response = await fetchWithRetry(options);

        if (api_response.userExists === false && api_response.nameOk === true) {
          fs.appendFile(
            "results/available_usernames.txt",
            selected_name + "\n",
            (err) => {}
          );
          unclaimed.push(selected_name);
        } else if (
          api_response.userExists === true ||
          api_response.nameOk === false
        ) {
          fs.appendFile(
            "results/unavailable_usernames.txt",
            selected_name + "\n",
            (err) => {}
          );
        } else {
          log(
            `Unknown response for ${selected_name}: ${JSON.stringify(
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
      log(`Error checking username ${selected_name}: ${error.message}`);
    }
  }

  log(
    `Done, ${unclaimed.length} of ${names.length} usernames are available. See available_usernames.txt for more info.`
  );
}

execute();
