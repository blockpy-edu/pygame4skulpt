import os
import json

output = 'dist/pygameskulpt.js'

INIT_FILES = [
    'rect.js',
]

def load_init_files():
    combined = []
    for filename in INIT_FILES + ['__init__.js']:
        with open(f'pygame/{filename}', 'rb') as pygame_file:
            contents = pygame_file.read()
        combined.append(contents.decode('utf-8'))
    return json.dumps("\n".join(combined))

with open(output, 'wb') as output_file:
    for filename in [f for f in os.listdir('pygame') if f not in INIT_FILES]:
        if filename == "__init__.js":
            contents = load_init_files()
        else:
            with open(f'pygame/{filename}', 'rb') as pygame_file:
                contents = pygame_file.read()
            contents = json.dumps(contents.decode('utf-8'))
        line = f"Sk.builtinFiles.files['src/lib/pygame/{filename}'] = {contents};\n"
        output_file.write(line.encode('utf-8'))
