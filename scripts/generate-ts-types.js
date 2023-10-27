/* eslint-disable @typescript-eslint/no-var-requires */

const neo4j = require('neo4j-driver');
const { OGM, generate } = require('@neo4j/graphql-ogm');
const { loadFiles: loadGraphqlTypeDefs } = require('@graphql-tools/load-files');
const path = require('path');
const fs = require('fs');

const main = async () => {
  const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('', ''));

  const graphqlFilePath = path.join(__dirname, '../src/typeDefs.graphql');
  console.log(`Loading GraphQL type definitions from ${graphqlFilePath}`);
  const typeDefs = await loadGraphqlTypeDefs(graphqlFilePath);

  const ogm = new OGM({ typeDefs, driver });

  const outDir = path.join(__dirname, '../src/generated');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const outFile = path.join(outDir, 'ogm-types.ts');

  await generate({
    ogm,
    outFile,
  });

  console.log(`Types Generated in file ${outFile}`);
};

main();
