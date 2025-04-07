# VRChat Username Availability Checker

This project checks the availability of usernames for VRChat using their API. The tool reads a list of potential usernames from text files in the `wordlists` directory and checks each one to see if it is available for registration.

## Features

- Loads usernames from `.txt` files located in the `wordlists` directory.
- Skips usernames that are already listed in `available_usernames.txt` or `unavailable_usernames.txt` in the `results` directory.
- Checks availability of usernames using VRChat's API.
- Handles rate-limiting with exponential backoff to avoid being blocked.
- Logs progress and estimated time remaining.
- Writes available usernames to `available_usernames.txt` in the `results` directory.
- Writes unavailable usernames to `unavailable_usernames.txt` in the `results` directory.

## Installation

1. Clone this repository or download the files.

2. Ensure you have `Node.js` installed. You can download it from [here](https://nodejs.org/).

3. Install the necessary dependencies by running:

```bash
npm install axios
```

## Usage

1. Place your username wordlists in the `wordlists/` directory. Each `.txt` file in that folder should contain one potential username per line.

2. Run the script:

```
node index.js
```

3. The script will process all usernames, and the results will be written to two files in the `results` directory.:

- `available_usernames.txt` for usernames that are available.
- `unavailable_usernames.txt` for usernames that are already taken.

4. The script will show progress updates during the process, including an estimated time remaining for completion.

## Files

- `index.js`: The main script that checks username availability.
- `wordlists/`: Directory containing text files with potential usernames.
- `results/available_usernames.txt`: A file where available usernames are saved.
- `results/unavailable_usernames.txt`: A file where unavailable usernames are saved.

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
