export function getRawQuery(graphQlSchema) {
  return graphQlSchema.loc.source.body;
}
