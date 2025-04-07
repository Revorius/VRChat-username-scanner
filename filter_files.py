import os;

def remove_duplicates_and_short_entries(input_file, output_file, min_length=4):
    try:
        # Open the input file for reading
        with open(input_file, 'r') as infile:
            # Read all lines
            lines = infile.readlines()

        # Filter out lines shorter than min_length and remove duplicates
        filtered_lines = set(line.strip() for line in lines if len(line.strip()) >= min_length)

        # Open the output file for writing (this will overwrite the file)
        with open(output_file, 'w') as outfile:
            # Write each unique line back to the output file
            for line in filtered_lines:
                outfile.write(line + '\n')

        print(f"Duplicates removed and short entries filtered. Clean file saved as {output_file}")

    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


# Get the current working directory
current_directory = os.getcwd()

# Loop through all files in the current directory
for filename in os.listdir(current_directory):
    if filename.endswith('.txt'):  # Only process .txt files
        input_file = os.path.join(current_directory, filename)
        
        # Create the output file name (same name as input file)
        output_file = os.path.join(current_directory, filename)
        
        # Call the function for each .txt file
        remove_duplicates_and_short_entries(input_file, output_file)
