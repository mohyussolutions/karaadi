import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  region: process.env.AWS_REGION,
  UserPoolId: process.env.KARAADI_AWS_COGNITO_USER_POOL_ID as string,
  ClientId: process.env.KARAADI_AWS_COGNITO_CLIENT_ID as string,
};

export const userPool = new CognitoUserPool(poolData);
