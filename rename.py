import os

# Set the directory where your images are located
directory = r"C:\BeepBoop\flask_sandbox\static\images"

def rename_files_in_directory(directory):
    # Get a list of all files in the directory
    files = [file for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]
    
    # Sort files alphabetically (optional, to ensure consistent numbering)
    files.sort()
    
    # Rename each file
    for index, file in enumerate(files):
        # Get the file extension
        file_extension = os.path.splitext(file)[1]
        
        # Create the new filename
        new_name = f"image{index + 1}{file_extension}"
        
        # Get the full path for the old and new filenames
        old_path = os.path.join(directory, file)
        new_path = os.path.join(directory, new_name)
        
        # Rename the file
        os.rename(old_path, new_path)
        print(f"Renamed: {file} -> {new_name}")

# Run the function
rename_files_in_directory(directory)
