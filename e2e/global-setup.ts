function globalSetup() {
  const params = [
    'ENVIRONMENT',
    'EMAIL',
    'PASSWORD',
    'EMAIL_PRO',
    'PASSWORD_PRO',
    'APP_NAME',
    'ADMIN_KEYCLOAK',
    'ADMIN_KEYCLOAK_PASSWORD',
    'SLACK_BOT_USER_OAUTH_TOKEN',
  ];

  const sendErrorIfUndefined = function (param: string) {
    if (typeof process.env[param] === 'undefined')
      throw new Error(`${param} is not defined at .env file`);
  };

  params.forEach((param) => sendErrorIfUndefined(param));
}

export default globalSetup;
