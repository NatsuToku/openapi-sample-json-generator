// File output settings
const inputFile = process.argv.length == 3 ? process.argv[2] : "./openapi.yaml";
const outputBasePath = "./output";
const outputRequestJSONName = "request";
const outputResponseJSONPrefix = "response";
const JSONSpaceNum = 4;

// Schema parse settings
const mediaType = "application/json";
const skipNonRequired = false;
const skipReadOnly = true;
const skipWriteOnly = false;

// Module import
const OpenAPISampler = require("openapi-sampler");
const SwaggerParser = require("@apidevtools/swagger-parser");
const fs = require("fs");

(async () => {
  const parser = await SwaggerParser.dereference(inputFile);

  Object.keys(parser.paths).forEach(function (path) {
    Object.keys(parser.paths[path]).forEach(function (method) {
      // Set output path based on API path & method
      // ex) path: /a/b/c, method: POST -> /outputBasePath/a_b_c/post
      const outputPath = `${outputBasePath}/${path
        .replace("/", "")
        .replace(/\//g, "_")}/${method}`;

      // Make directory for output JSON files
      fs.mkdir(outputPath, { recursive: true }, (err) => {
        const api = parser.paths[path][method];

        // If requestBody is exist, generate sample JSON object
        let requestSample = {};
        if (
          api.hasOwnProperty("requestBody") &&
          api.requestBody.hasOwnProperty(mediaType)
        ) {
          requestSample = OpenAPISampler.sample(
            api.requestBody.content[mediaType].schema,
            {
              skipNonRequired: skipNonRequired,
              skipReadOnly: skipReadOnly,
              skipWriteOnly: skipWriteOnly,
            }
          );
        }
        // Output requestBody JSON (if requestBody is not exist, output empty JSON)
        fs.writeFileSync(
          `${outputPath}/${outputRequestJSONName}.json`,
          JSON.stringify(requestSample, null, JSONSpaceNum)
        );

        const responses = api.responses;
        Object.keys(responses).forEach(function (status) {
          // If content is exist, generate sample JSON object
          let responseSample = {};
          if (
            responses[status].hasOwnProperty("content") &&
            responses[status].content.hasOwnProperty(mediaType)
          ) {
            responseSample = OpenAPISampler.sample(
              responses[status].content[mediaType].schema,
              {
                skipNonRequired: skipNonRequired,
                skipReadOnly: skipReadOnly,
                skipWriteOnly: skipWriteOnly,
              }
            );
          }
          // Output responses JSON (if content is not exist, output empty JSON)
          fs.writeFileSync(
            `${outputPath}/${outputResponseJSONPrefix}_${status}.json`,
            JSON.stringify(responseSample, null, JSONSpaceNum)
          );
        });
      });
    });
  });
})();
