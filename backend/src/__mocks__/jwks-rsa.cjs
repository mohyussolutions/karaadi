function createClient() {
  return {
    getSigningKey: (_kid, callback) => {
      callback(null, { getPublicKey: () => "mock-public-key" });
    },
  };
}
module.exports = createClient;
