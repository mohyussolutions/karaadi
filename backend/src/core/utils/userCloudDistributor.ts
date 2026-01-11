import { CognitoIdentityServiceProvider } from "aws-sdk";
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";
import {
  azureConfig,
  cognitoConfig,
} from "cloudProvidersConfig/cloudProvidersConfig.ts";

const cognitoClient = new CognitoIdentityServiceProvider({
  region: cognitoConfig.region,
});

const credential = new ClientSecretCredential(
  azureConfig.tenantId,
  azureConfig.clientId,
  azureConfig.clientSecret
);

const azureClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const token = await credential.getToken(
        "https://graph.microsoft.com/.default"
      );
      return token?.token || "";
    },
  },
});

const MAX_FREE_USERS = 50000;

async function getCognitoUserCount(userPoolId: string) {
  const data = await cognitoClient
    .listUsers({ UserPoolId: userPoolId, Limit: 60 })
    .promise();
  return data.Users?.length || 0;
}

async function getAzureB2CUserCount() {
  const users = await azureClient.api("/users").get();
  return users.value.length;
}

export async function registerUser(username: string, email: string) {
  const cognitoCount = await getCognitoUserCount(cognitoConfig.userPoolId);
  const azureCount = await getAzureB2CUserCount();

  const target =
    cognitoCount < MAX_FREE_USERS
      ? "Cognito"
      : azureCount < MAX_FREE_USERS
      ? "Azure"
      : cognitoCount <= azureCount
      ? "Cognito"
      : "Azure";

  if (target === "Cognito") {
    await cognitoClient
      .adminCreateUser({
        UserPoolId: cognitoConfig.userPoolId,
        Username: username,
        UserAttributes: [{ Name: "email", Value: email }],
      })
      .promise();
  } else {
    await azureClient.api("/users").post({
      accountEnabled: true,
      displayName: username,
      mailNickname: username,
      userPrincipalName: email,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: "Temp1234!",
      },
    });
  }
}
