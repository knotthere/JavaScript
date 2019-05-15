#! /usr/bin/env node

const fs = require('fs');

if (process.argv[2]) {
  console.log(process.argv[2]);


  let fileAsString = fs.readFileSync(process.argv[2]);

  // Convert to JSON
  let fileAsJson = JSON.parse(fileAsString);

  // console.log(JSON.stringify(fileAsJson, null, 2));

  // Now, see if any children are strings that are also json...
  let response = {};
  Object.keys(fileAsJson).forEach(key => {
    console.log(fileAsJson[key]);
    let value = fileAsJson[key];  // default
    if (typeof value === 'string' || value instanceof String) {
      try {
        value = JSON.parse(value);
      } catch (error) {
        console.log(value + ' is not JSON');
      }
    }
    response[key] = value;
  });

  console.log(JSON.stringify(response, null, 2));
}