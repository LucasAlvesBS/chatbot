#!/bin/sh

npx ts-node ./node_modules/typeorm/cli.js  migration:run -d ./dist/config/typeorm/dataSource.typeorm.js

node dist/main