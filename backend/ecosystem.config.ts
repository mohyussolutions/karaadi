export default {
  apps: [
    {
      name: "karaadi-backend-dev",
      script: "npm",
      args: "run dev --prefix backend",
      env: {
        NODE_ENV: "development",
      },
      watch: false,
    },
    {
      name: "karaadi-backend-prod",
      script: "npm",
      args: "run start --prefix backend",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
    },
  ],
};
