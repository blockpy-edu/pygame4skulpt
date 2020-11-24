import os
import json

output = 'dist/pygameskulpt.js'

with open(output, 'wb') as output_file:
    for filename in os.listdir('pygame'):
        with open(f'pygame/{filename}', 'rb') as pygame_file:
            contents = pygame_file.read()
        contents = json.dumps(contents.decode('utf-8'))
        line = f"Sk.builtinFiles.files['src/lib/pygame/{filename}'] = {contents};\n"
        output_file.write(line.encode('utf-8'))
