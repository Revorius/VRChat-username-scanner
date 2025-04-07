const fs = require("node:fs");
const path = require("node:path"); // Add the path module
const axios = require("axios");

var queue = [];
var ignore = ["brands.txt", "cities.txt", "countries.txt", "names.txt"];
var timeout = false;
let dictionary_local = fs
  .readFileSync("dictionary.txt", "UTF-8")
  .split(/\r?\n|\r/);

function walkDirectory(dir) {
  let contents = fs.readdirSync(dir);
  for (let i = 0; i < contents.length; i++) {
    const fullPath = path.join(dir, contents[i]); // Create the full path
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDirectory(fullPath); // Recursively walk the directory
    } else if (fs.lstatSync(fullPath).isFile()) {
      if (fullPath.includes(".txt") && !fullPath.includes("LICENSE")) {
        let ignored = false;
        for (let k = 0; k < ignore.length; k++) {
            console.log(ignore[k]);
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

async function dictionaryCheckOnline(word, attempt = 1) {
  let options = {
    url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    method: "GET",
    headers: { "User-Agent": "Mozilla/5.0" },
  };

  try {
    timeout = false;
    const response = await axios(options);
    await new Promise((resolve) => setTimeout(resolve, 25));
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      if (timeout == false) {
        console.log("Waiting for the API timeout to be over...");
      }
      timeout = true;
      const delay = Math.pow(2, attempt) * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return dictionaryCheckOnline(word, attempt + 1); // Retry after delay
    } else if (error.response && error.response.status == 404) {
      timeout = false;
      return false;
    } else {
      throw error; // Throw other errors
    }
  }
}

function dictionaryCheck(word) {
  if (dictionary_local.indexOf(word) > -1) return true;
  return false;
}

async function execute(dir, online) {
  walkDirectory(dir);
  for (let i = 0; i < queue.length; i++) {
    let path = queue[i];
    console.log(`Checking file: ${path}`);
    let contents = await fs.readFileSync(path, "UTF-8");
    let split = contents.split(/\r?\n|\r/);
    let toCheckOnline = [];
    let result = [];

    for (let k = 0; k < split.length; k++) {
      let selected_username = split[k];
      console.log(`Checking ${selected_username} [${k + 1}/${split.length}]`);
      if (dictionaryCheck(selected_username) == true) {
        result.push(selected_username);
      } else if (online == true) {
        toCheckOnline.push(selected_username);
      }
    }

    for (let k = 0; k < toCheckOnline.length; k++) {
      let selected_username = toCheckOnline[k];
      console.log(
        `Checking ${selected_username} online [${k + 1}/${
          toCheckOnline.length
        }]`
      );
      if ((await dictionaryCheckOnline(selected_username)) == true) {
        result.push(selected_username);
      }
    }

    fs.unlinkSync(path);
    fs.appendFile(path, result.join("\n"), (err) => {});
  }
}

execute(__dirname + "/results");
