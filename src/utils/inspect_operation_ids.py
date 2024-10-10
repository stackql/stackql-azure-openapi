import os
import yaml
import csv

# Directory containing the OpenAPI YAML files
input_directory = '/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/openapi/src/azure/v00.00.00000/services'

# Output CSV file
output_csv = 'output.csv'

# def get_updated_op_id(operation_id):
#     # Check if operation_id is splittable by '_'
#     parts = operation_id.split('_')
    
#     if len(parts) == 1:
#         # Not splittable
#         if operation_id.startswith('List') or operation_id.startswith('Get'):
#             verb = 'List' if operation_id.startswith('List') else 'Get'
#             rest = operation_id[len(verb):]
#             return f"{rest}_{verb}"
#         else:
#             return "replace_me"
    
#     # Splittable
#     first_part, second_part = parts[0], parts[1]
    
#     # Check first part patterns, excluding 'Deleted'
#     if any(first_part.lower().startswith(pattern.lower()) for pattern in ['Create', 'Delete', 'Get', 'List']) and not first_part.lower().startswith('deleted'):
#         return f"{second_part}_{first_part}"
    
#     # Check second part exact matches
#     exact_matches = [
#         'Create', 'CreateAndUpdate', 'CreateOrReplace', 'CreateOrUpdate', 'CreateIfNotExist',
#         'CreateUpdate', 'Delete', 'Get', 'GetAll', 'List', 'ListAll', 'Patch', 'Put',
#         'Update', 'Replace', 'ReplaceAll', 'UpdatePatch', 'UpdatePut'
#     ]
#     if second_part.lower() in [match.lower() for match in exact_matches]:
#         return ""
    
#     # Check second part patterns
#     pattern_matches = [
#         'CreateIn', 'CreateBy', 'CreateOrUpdateBy', 'DeleteBy', 'DeleteIn', 'GetBy',
#         'GetIn', 'ListAllBy', 'ListBy', 'ListIn', 'ListWith', 'UpdateBy'
#     ]
#     if any(second_part.lower().startswith(pattern.lower()) for pattern in pattern_matches) and not second_part.lower() == 'instances':
#         return ""
    
#     # Check if second part doesn't start with specific prefixes
#     non_matching_prefixes = [
#         'Create', 'Get', 'GetAll', 'Update', 'Replace', 'ReplaceAll', 'Delete', 'List', 'ListAll'
#     ]
#     if not any(second_part.startswith(prefix) for prefix in non_matching_prefixes):
#         return ""
    
#     # New logic for handling specific verbs at the start of the second part
#     verbs = ['Create', 'CreateOrUpdate', 'Get', 'List', 'Delete', 'Update']
#     for verb in verbs:
#         if second_part.startswith(verb):
#             rest = second_part[len(verb):]
#             # Check for By*, In* (except Instances), or With* at the end
#             if rest.endswith(('By', 'In', 'With')) or (rest.endswith('Instances') and not rest == 'Instances'):
#                 return f"{first_part}{rest}_{second_part}"
#             else:
#                 return f"{first_part}{rest}_{verb}"
    
#     # If we've reached this point, return "replace_me"
#     return "replace_me"

# Function to parse YAML and search for resources
def parse_yaml_file(file_path):
    with open(file_path, 'r') as file:
        try:
            return yaml.safe_load(file)
        except yaml.YAMLError as e:
            print(f"Error parsing YAML file {file_path}: {e}")
            return None

# Function to process the OpenAPI specs and generate CSV rows
def process_specs(directory):
    csv_rows = []

    for filename in os.listdir(directory):
        if filename.endswith('.yaml'):
            file_path = os.path.join(directory, filename)
            yaml_content = parse_yaml_file(file_path)
            if yaml_content is None:
                continue
            
            # Extracting the service name (file name without .yaml)
            service_name = filename.replace('.yaml', '')

            # Traverse the x-stackQL-resources section
            resources = yaml_content.get('components', {}).get('x-stackQL-resources', {})
            for resource_name, resource_data in resources.items():
                methods = resource_data.get('methods', {})
                for method_name, method_data in methods.items():
                    operation_id = method_data.get('operation', {}).get('operationId')
                    ref = method_data.get('operation', {}).get('$ref')
                    verb = ref.split('/')[-1]
                    path = ref.replace('~1', '/').replace(f'/{verb}', '')[8:]
                    schemaRef = method_data.get('response', {}).get('schemaRef')
                    num_select_routes = len(resource_data.get('sqlVerbs', {}).get('select', []))
                    if len(operation_id.split('_')) == 1:
                        opidpart1 = operation_id
                        opidpart2 = ''
                    else:
                        opidpart1 = operation_id.split('_')[0]
                        opidpart2 = operation_id.split('_', 1)[1]
                    operation = yaml_content.get('paths', {}).get(path, {}).get(verb, {})
                    desc = operation.get('description', '')
                    original_op_id = operation.get('x-ms-original-operationId', '')
                    csv_rows.append([service_name, resource_name, method_name, original_op_id, operation_id, opidpart1, opidpart2, path, verb, schemaRef, desc, num_select_routes])
    return csv_rows

# Writing the CSV output
def write_to_csv(csv_rows, output_file):
    with open(output_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Writing the header row
        writer.writerow(['Service', 'Resource', 'Method', 'OriginalOpId', 'FinalOpId', 'Part1', 'Part2', 'Path', 'Verb', 'Schema', 'Desc', 'NumSelectRoutesForRes'])
        # Writing the data rows
        writer.writerows(csv_rows)

if __name__ == '__main__':
    csv_rows = process_specs(input_directory)
    write_to_csv(csv_rows, output_csv)
    print(f"CSV output written to {output_csv}")
