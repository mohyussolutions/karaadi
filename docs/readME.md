$ 1. Backend Development

- User Management: Enable users to delete their own accounts and grant admins the authority to remove unnecessary user records.
- Media Integration: Configure S3 image uploads served via CloudFront, secured with Cognito authentication.
- Refactoring: Standardize backend TypeScript types and remove all obsolete comments to clean the codebase.
- Payment Systems: Fix and optimize the integration for both Waafi mobile payments and Card gateways. Add user plans (90, 60, 30 days) and ensure plan logic is enforced in backend.
- Data Integrity: Implement strict Zod/validation components to ensure only sanitized, safe data is persisted to the server.
- User Plans: Implement 90-day, 60-day, and 30-day plans for users. Enforce plan selection and logic in backend.

$ 2. Frontend Development

N.B: Users with the 90-day plan will always be prioritized and shown at the top of item lists in the frontend. All payment-protected routes must enforce authentication and valid plan status.

- Chat UI: Repair and finalize the specialized chat message component logic.
- Architecture: Refactor frontend actions into three distinct, organized components for better maintainability.
- Validation: Implement comprehensive form validation to improve user experience and data quality.
- Type Safety: Audit and fix all TypeScript type definitions across the frontend.
- Production Prep: Complete the final build process and optimize assets.
- Payment UI: Integrate payment workflow in the frontend and protect all routes that require authentication or payment.
- User Plan Display: Show users who chose the 90-day plan at the top of item lists.

$ 3. Deployment

- AWS Infrastructure: Execute the deployment to the AWS production environment.
- Payment Configuration: Finalize the live update for payment card processing settings.
- Observability: Set up system monitoring and alerts to track performance and errors.

$ 4. Future Roadmap

- Scalability: Transition the monolithic architecture to Spring Boot Microservices as the user base scales.
