export const paymentTestCases = {
  success: [
    {
      method: "evc",
      phone: "615000000",
      description: "Valid Hormuud (61x) number",
    },
    {
      method: "sahal",
      phone: "625000000",
      description: "Valid Somtel (62x) number",
    },
    {
      method: "sahal",
      phone: "635000000",
      description: "Valid Telesom (63x) number",
    },
    {
      method: "sahal",
      phone: "655000000",
      description: "Valid Somtel (65x) number",
    },
    {
      method: "sahal",
      phone: "907000000",
      description: "Valid Golis (90x) number",
    },
  ],
  failed: [
    {
      category: "validation",
      method: "evc",
      phone: "625000000",
      expected_error: "Invalid prefix for EVC. Expected: 61...",
    },
    {
      category: "validation",
      method: "sahal",
      phone: "615000000",
      expected_error: "Invalid prefix for SAHAL. Expected: 62, 65, 63, 90...",
    },
    {
      category: "validation",
      method: "evc",
      phone: "612",
      expected_error: "Invalid phone number length",
    },
    {
      category: "server",
      method: "evc",
      phone: "615000000",
      expected_error: "Insufficient balance",
    },
    {
      category: "server",
      method: "sahal",
      phone: "625000000",
      expected_error: "Payment failed",
    },
  ],
};
