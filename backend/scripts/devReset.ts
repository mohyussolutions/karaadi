import prisma from "../src/core/utils/db.ts";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const POOL_ID = process.env.KARAADI_AWS_COGNITO_USER_POOL_ID!;

async function checkEmail(email: string) {
  console.log(`\n--- Checking: ${email} ---`);

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, cognitoId: true, createdAt: true },
  });
  console.log("DB:", dbUser ? `FOUND (id=${dbUser.id}, cognito=${dbUser.cognitoId})` : "NOT FOUND");

  try {
    const cognitoUser = await cognito.send(
      new AdminGetUserCommand({ UserPoolId: POOL_ID, Username: email }),
    );
    console.log("Cognito:", `FOUND (status=${cognitoUser.UserStatus})`);
  } catch (err: any) {
    console.log("Cognito:", err?.name === "UserNotFoundException" ? "NOT FOUND" : `ERROR: ${err.message}`);
  }
}

async function deleteEmail(email: string) {
  console.log(`\n--- Deleting: ${email} ---`);

  const dbUser = await prisma.user.findUnique({ where: { email }, select: { id: true, cognitoId: true } });
  if (dbUser) {
    await prisma.user.delete({ where: { email } });
    console.log("DB: deleted");
  } else {
    console.log("DB: not found, skipped");
  }

  try {
    await cognito.send(new AdminDeleteUserCommand({ UserPoolId: POOL_ID, Username: email }));
    console.log("Cognito: deleted");
  } catch (err: any) {
    console.log("Cognito:", err?.name === "UserNotFoundException" ? "not found, skipped" : `ERROR: ${err.message}`);
  }
}

async function resetAll() {
  console.log("\n--- Resetting users + category listings ---");

  await prisma.$transaction([
    prisma.cookie.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.message.deleteMany(),
    prisma.userView.deleteMany(),
    prisma.marketplace.deleteMany(),
    prisma.realEstate.deleteMany(),
    prisma.boat.deleteMany(),
    prisma.car.deleteMany(),
    prisma.motorcycle.deleteMany(),
    prisma.farmequipment.deleteMany(),
    prisma.job.deleteMany(),
    prisma.business.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  try {
    const listed = await cognito.send(new ListUsersCommand({ UserPoolId: POOL_ID, Limit: 60 }));
    for (const u of listed.Users ?? []) {
      if (u.Username) {
        await cognito.send(new AdminDeleteUserCommand({ UserPoolId: POOL_ID, Username: u.Username }));
        console.log(`Cognito: deleted ${u.Username}`);
      }
    }
  } catch (err: any) {
    console.log("Cognito reset error:", err.message);
  }

  console.log("Done.");
}

async function main() {
  const [, , cmd, arg] = process.argv;

  if (cmd === "check" && arg) {
    await checkEmail(arg);
  } else if (cmd === "delete" && arg) {
    await deleteEmail(arg);
  } else if (cmd === "reset-all") {
    console.log("WARNING: this wipes all users and listings.");
    await resetAll();
  } else {
    console.log(`
Usage:
  npx tsx --env-file=../.env.local scripts/devReset.ts check <email>
  npx tsx --env-file=../.env.local scripts/devReset.ts delete <email>
  npx tsx --env-file=../.env.local scripts/devReset.ts reset-all
    `);
  }

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
