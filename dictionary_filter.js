const fs = require("node:fs");
const path = require("node:path"); // Add the path module
const axios = require("axios");

var queue = [];
var ignore = ["brands.txt"];
var timeout = false;

function walkDirectory(dir) {
  let contents = fs.readdirSync(dir);
  for (let i = 0; i < contents.length; i++) {
    const fullPath = path.join(dir, contents[i]); // Create the full path
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDirectory(fullPath); // Recursively walk the directory
    } else if (fs.lstatSync(fullPath).isFile()) {
      if (fullPath.endsWith(".txt") && !fullPath.endsWith("LICENSE")) {
        let ignored = false;
        for (let k = 0; k < ignore.length; k++) {
          if (fullPath.endsWith(ignore[k])) ignored = true;
        }
        if (ignored == false) {
          queue.push(fullPath);
        } else {
          console.log(`Ignored ${fullPath} for checking.`);
        }
      }
    }
  }
}

async function dictionaryCheck(word, attempt = 1) {
  let options = {
    url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    method: "GET",
    headers: { "User-Agent": "Mozilla/5.0" },
  };

  try {
    timeout = false;
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (timeout == false) {
        console.log("Waiting for the API timeout to be over...");
        timeout = true;
      }
      return dictionaryCheck(word, attempt + 1); // Retry after delay
    } else if (error.response && error.response.status == 404) {
      timeout = false;
      return false;
    } else {
      throw error; // Throw other errors
    }
  }
}

async function execute() {
  walkDirectory(__dirname + "/wordlists");
  let toCheck = [];

  for (let i = 0; i < queue.length; i++) {
    let path = queue[i];
    console.log(`Checking file: ${path}`);
    let contents = await fs.readFileSync(path, "UTF-8");
    let split = contents.split(/\r?\n|\r/);
    let result = [];

    for (let k = 0; k < split.length; k++) {
      let selected_username = split[k];
      console.log(`Checking ${selected_username} [${k + 1}/${split.length}]`);
      if (await dictionaryCheck(selected_username)) {
        result.push(selected_username);
      }
    }

    fs.unlinkSync(path);
    fs.appendFile(path, result.join("\n"), (err) => {});
  }
}

execute();
