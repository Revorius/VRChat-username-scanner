import os

def sort_file_content(input_file, output_file):
    # Open the input file for reading
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as file:
        # Read the content, normalize line breaks, and split into a list of lines
        lines = file.read().replace('\r\n', '\n').replace('\r', '\n').split('\n')
        
        # Remove any empty lines that might have been added by newlines at the end
        lines = [line for line in lines if line.strip()]
        
        # Sort the lines alphabetically
        lines.sort()
        
    # Open the output file for writing
    with open(output_file, 'w', encoding='utf-8') as file:
        # Write the sorted lines to the output file
        for line in lines:
            file.write(line.lower() + '\n')

def process_directory(directory):
    # Loop through all files and subdirectories in the current directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        
        # If it's a directory, call process_directory recursively
        if os.path.isdir(filepath):
            process_directory(filepath)
        elif filename.endswith('.txt'):  # Only process .txt files
            output_file = filepath  # Output file has the same name as the input
            sort_file_content(filepath, output_file)

# Get the current working directory
current_directory = os.getcwd()

# Start processing the current directory and its subdirectories
process_directory(current_directory)
