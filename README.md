# VRChat Username Availability Toolkit

This toolkit helps you check the availability of usernames for VRChat using their API, and includes utilities to prepare, filter, and refine your wordlists. It supports both Python and JavaScript tools for cleaning, sorting, filtering, and scanning potential usernames.

## Features

- Load usernames from `.txt` files located in the `wordlists/` directory.
- Filter short, invalid, or duplicate usernames using `filter_files.py`.
- Alphabetically sort and normalize usernames with `sort_alpha.py`.
- Filter usernames using a dictionary check with `dictionary_filter.js`.
- Check availability of usernames using VRChat's public API via `index.js`.
- Skip usernames already scanned by referencing `available_usernames.txt` and `unavailable_usernames.txt`.
- Handles API rate-limiting with exponential backoff.
- Logs progress and estimated time remaining.
- Saves results in the `results/` directory.

## Installation

1. Clone this repository or download the files.

2. Ensure you have both **Node.js** and **Python 3** installed.

3. Install dependencies:

For JavaScript tools:

```
npm install axios
```

No additional libraries are required for Python scripts (they use built-in modules).

## Usage

### 1. Prepare Wordlists

Run the Python scripts to clean and sort your wordlists:

```
python filter_files.py
python sort_alpha.py
```

Optional: Filter by dictionary validity using JavaScript:

```
node dictionary_filter.js
```

### 2. Check Username Availability

Place `.txt` wordlist files in the `wordlists/` directory, then run:

```
node index.js
```

The script will:

- Check each username's availability
- Save results in `results/available_usernames.txt` and `results/unavailable_usernames.txt`
- Avoid re-checking previously scanned names
- Show progress updates and estimated time remaining

## Files Overview

- `filter_files.py`: Cleans and filters usernames (length, symbols, duplicates)
- `sort_alpha.py`: Alphabetically sorts cleaned usernames
- `dictionary_filter.js`: Filters by real-word dictionaries (local + API)
- `index.js`: Checks username availability on VRChat via API
- `wordlists/`: Input text files, one username per line
- `results/`: Output directory for available/unavailable username logs

## License

This project is licensed under the GPLv3 License – see the [LICENSE](LICENSE) file for details.