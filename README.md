# openapi-sample-json-generator

This script generates sample JSON of requestBody/responses from OpenAPI document files.

## Installation

```sh
npm install
```

## Usage

```sh
node ./generator.js <OPENAPI_FILE_NAME>
```

If the argument `<OPENAPI_FILE_NAME>` is omitted, ". /openapi.yaml" will be loaded by default.

## Settings

Change the settings if necessary.

- `inputFile`: File name of the OpenAPI format.
- `outputBasePath`: Path to output the JSON files
- `outputRequestJSONName`: Output JSON file name of requestBody
- `outputResponseJSONPrefix`: The prefix used for the output JSON file name of responses
- `JSONSpaceNum`: Number of spaces for indentation in JSON file
- `mediaType`: Media type to be parsed
- `skipNonRequired`: Whether to skip parameters where `required` is true
- `skipReadOnly`: Whether to skip parameters where `readOnly` is true
- `skipWriteOnly`: Whether to skip parameters where `writeOnly` is true
