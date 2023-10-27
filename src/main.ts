import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server';
import { loadFiles as loadGraphqlTypeDefs } from '@graphql-tools/load-files';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import neo4j from 'neo4j-driver';
import path from 'path';
import { resolvers } from './resolvers';

const main = async () => {
  // DB driver
  const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('', ''));

  // load graphql schema
  const graphqlFilePath = path.join(__dirname, '../src/typeDefs.graphql');
  console.log(`Loading GraphQL type definitions from ${graphqlFilePath}`);
  const typeDefs = await loadGraphqlTypeDefs(graphqlFilePath);

  // middleware
  const neo4jGraphql = new Neo4jGraphQL({
    driver,
    typeDefs,
    resolvers,
  });

  // get graphql schema
  const schema = await neo4jGraphql.getSchema();

  // initialize indexes & constraints
  await neo4jGraphql.assertIndexesAndConstraints({ options: { create: true } });

  // console.log(schema);

  const server = new ApolloServer({
    schema,
    // context: ({ req }) => ({ req }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  const info = await server.listen();
  console.log(info.url);
};

main();
