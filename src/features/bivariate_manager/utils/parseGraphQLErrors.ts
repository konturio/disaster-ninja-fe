export function parseGraphQLErrors(response: { errors?: unknown }) {
  if (
    response.hasOwnProperty('errors') &&
    Array.isArray(response['errors'])
  ) {
    return response['errors']
      .reduce((acc, errorObj) => {
        if (errorObj.hasOwnProperty('message')) {
          acc.push(errorObj['message']);
        }
        return acc;
      }, [])
      .join('<br/>');
  }
}
