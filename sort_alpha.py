import os;

def sort_file_content(input_file, output_file):
    # Open the input file for reading
    with open(input_file, 'r', encoding='utf-8') as file:
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
            file.write(line + '\n')

# Get the current working directory
current_directory = os.getcwd()

# Loop through all files in the current directory
for filename in os.listdir(current_directory):
    if filename.endswith('.txt'):  # Only process .txt files
        input_file = os.path.join(current_directory, filename)
        
        # Create the output file name (same name as input file)
        output_file = os.path.join(current_directory, filename)
        
        # Call the function for each .txt file
        sort_file_content(input_file, output_file)