import os

def remove_duplicates_and_short_entries(input_file, output_file, min_length=4):
    try:
        # Open the input file for reading
        with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile:
            # Read all lines
            lines = infile.readlines()

        # Filter out lines shorter than min_length and remove duplicates
        filtered_lines = set(line.strip() for line in lines if '-' not in line and "'" not in line and '.' not in line and len(line.strip()) >= min_length)

        # Open the output file for writing (this will overwrite the file)
        with open(output_file, 'w', encoding='utf-8', errors='ignore') as outfile:
            # Write each unique line back to the output file
            for line in filtered_lines:
                outfile.write(line + '\n')

        print(f"Duplicates removed and short entries filtered. Clean file saved as {output_file}")

    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

def process_directory(directory):
    # Loop through all files and subdirectories in the current directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        
        # If it's a directory, call process_directory recursively
        if os.path.isdir(filepath):
            process_directory(filepath)
        elif filename.endswith('.txt'):  # Only process .txt files
            output_file = filepath  # Output file has the same name as the input
            remove_duplicates_and_short_entries(filepath, output_file)

# Get the current working directory
current_directory = os.getcwd()

# Start processing the current directory and its subdirectories
process_directory(current_directory)
