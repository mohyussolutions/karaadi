export interface SupportTicketSeed {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  status: "NEW" | "IN_PROGRESS" | "DONE" | "RESOLVED" | "CLOSED";
  adminReply?: string;
}

export const supportTicketSeedData: SupportTicketSeed[] = [
  {
    senderName: "Grace Miller",
    senderEmail: "grace.miller@globalventures.com",
    subject:
      "Urgent: Failed Payment Processing for Real Estate Listing ID RE4021",
    body: "I attempted to upgrade my premium listing for a property in the city center (Listing ID RE4021) approximately three hours ago. The transaction showed as 'pending' on my dashboard and then abruptly failed. My bank confirmed the funds were reserved but the payment gateway provided an error code starting with 'PGW-500'. I need this listing boosted immediately. Can you please investigate the specific cause of the payment failure and advise on an alternate method to complete the transaction without delay? I have attached screenshots of the error page.",
    status: "NEW",
  },
  {
    senderName: "Henry Kwan",
    senderEmail: "henry.kwan@techsupport.net",
    subject: "Missing Images and Corrupted Description on Marketplace Ad",
    body: "My Marketplace ad (ID MP1998) is displaying improperly. Half of the uploaded product images are missing, showing broken links instead. Furthermore, the description field, which was quite long, appears truncated mid-sentence, and strange characters (like Ã¤Â») are showing up at the end. I suspect a character encoding issue during saving. I need a representative to manually review the listing data integrity on the backend and ensure all content is restored and correctly displayed. This is severely impacting my sales.",
    status: "NEW",
  },
  {
    senderName: "Isabel Garcia",
    senderEmail: "isabel.garcia@outlook.es",
    subject: "Resolution Confirmed: Account Hacked, Now Secure",
    body: "Thank you for the prompt action in response to my ticket last week regarding unauthorized access. The account was temporarily locked, and I successfully reset my password and enabled two-factor authentication. I have reviewed my listings and confirmed no unauthorized changes were made. You may now mark this entire incident and the associated tickets as fully resolved. I appreciate the swift and professional support provided by your security team.",
    status: "RESOLVED",
    adminReply:
      "Dear Isabel, we are pleased to confirm that your account security issue has been completely resolved. Our logs show no further suspicious activity after the password reset and 2FA activation. We are now marking this ticket as RESOLVED. Please contact us immediately if you notice any other anomalies.",
  },
  {
    senderName: "Jackson Lee",
    senderEmail: "jackson.lee@mail.co.uk",
    subject: "Incorrect Price Display on Motorcycle Search Results Page",
    body: "When users search for motorcycles in the London area, my listing for the 'Vintage 1978 Kawasaki' (ID MTC305) shows a price of £1,500 on the main search results page. However, when a user clicks through to the actual listing detail page, the correct price of £1,250 is displayed. This discrepancy is confusing potential buyers. Please investigate why the search index is caching an old price and update it immediately across all search services.",
    status: "NEW",
  },
  {
    senderName: "Karen Chen",
    senderEmail: "karen.chen@example.org",
    subject: "Request for Data Export: All My Listings and Chat History",
    body: "As I am preparing to relocate and will no longer be using the service, I would like to request a full data export, often referred to as a GDPR data request. I need a structured file (JSON or CSV) containing all data associated with my user ID, including every listing I have ever created (Boat, Car, Traktor), my entire private chat message history with other users, and a record of all payments made. Please confirm the expected time frame for this data retrieval.",
    status: "NEW",
  },
];
