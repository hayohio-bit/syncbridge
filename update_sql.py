import sys

file_path = r'C:\Users\선하영\workspace\SyncBridge\backend\src\main\resources\data.sql'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
modify_rows = False

for line in lines:
    if 'INSERT INTO jargon_translations' in line and '(jargon_id, target_role, easy_definition, business_impact)' in line:
        new_line = line.replace('(jargon_id, target_role, easy_definition, business_impact)', 
                                '(jargon_id, target_role, easy_definition, business_impact, helpful_count, unhelpful_count)')
        new_lines.append(new_line)
        modify_rows = True
    elif modify_rows and line.strip().startswith('('):
        if line.strip().endswith('),'):
            # Handle possible trailing spaces before the comma
            content = line.rstrip()
            if content.endswith('),'):
                new_line = content[:-2] + ', 0, 0),\n'
            else:
                new_line = line # Should not happen based on current file structure
            new_lines.append(new_line)
        elif line.strip().endswith(');'):
            # Handle possible trailing spaces before the semicolon
            content = line.rstrip()
            if content.endswith(');'):
                new_line = content[:-2] + ', 0, 0);\n'
            else:
                new_line = line # Should not happen
            new_lines.append(new_line)
            modify_rows = False # End of current INSERT block
        else:
            new_lines.append(line)
    else:
        if modify_rows and line.strip() == '':
            modify_rows = False
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Successfully updated data.sql")
