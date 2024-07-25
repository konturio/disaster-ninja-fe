function globalSetup() {
  if (typeof process.env.ENVIRONMENT === 'undefined')
    throw new Error('ENVIRONMENT is not defined at .env file');
  if (typeof process.env.EMAIL === 'undefined')
    throw new Error('EMAIL of user with no rights is not defined at .env file');
  if (typeof process.env.PASSWORD === 'undefined')
    throw new Error('PASSWORD of user with no rights is not defined at .env file');
  if (typeof process.env.EMAIL_PRO === 'undefined')
    throw new Error(
      'EMAIL_PRO (email of user with PRO rights) is not defined at .env file',
    );
  if (typeof process.env.PASSWORD_PRO === 'undefined')
    throw new Error(
      'PASSWORD_PRO (password of user with PRO rights) is not defined at .env file',
    );
  if (typeof process.env.APP_NAME === 'undefined')
    throw new Error(
      'APP_NAME (application like atlas, oam, etc) is not defined at .env file',
    );
  if (typeof process.env.ADMIN_KEYCLOAK === 'undefined')
    throw new Error(
      'ADMIN_KEYCLOAK (login for admin at keycloak) is not defined at .env file',
    );
  if (typeof process.env.ADMIN_KEYCLOAK_PASSWORD === 'undefined')
    throw new Error(
      'ADMIN_KEYCLOAK_PASSWORD (password for admin at keycloak) is not defined at .env file',
    );
  if (typeof process.env.SLACK_BOT_USER_OAUTH_TOKEN === 'undefined')
    throw new Error(
      'SLACK_BOT_USER_OAUTH_TOKEN (token to send results to Slack) is not defined at .env file',
    );
}

export default globalSetup;
