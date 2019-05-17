// Copyright 2019, Blacktoque Software.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = (module.exports = require('nconf'));
const path = require('path');
const checkConfig = (setting) => {
   if (!nconf.get(setting)) {
      throw new Error(
         `You must set ${setting} as an environment variable or in envs.json!`
      );
   }
}

nconf
   // 1. Command-line arguments
   .argv()
   // 2. Environment variables
   .env([
      'API_KEY',
   ])
   // 3. Config file
   .file({ file: path.join(__dirname, 'envs.json') })
   // 4. Defaults
   .defaults({
      API_KEY: '',
      PORT: 8080,
   });

// Check for required settings
checkConfig('API_KEY');

