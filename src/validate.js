import $RefParser from '@apidevtools/json-schema-ref-parser';

export async function validate(spec) {
    return await $RefParser.parse(spec);
}