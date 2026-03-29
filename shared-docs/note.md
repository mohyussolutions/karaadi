1: Backend Development

# implimment transalte i18n

# User Management: Build Self-Delete (user) and Remove User (admin) features. you need IAM access

2: Frontend Development

# Move sorting/filtering logic to backend.

# Implement lazy loading for maps, charts, and heavy components.

# Optimize bundle size with code splitting and dynamic imports.

# Compress and optimize images.

# Profile frontend with browser dev tools to find slow renders.

# Monitor backend performance and optimize database/Redis queries.

Localization: Add Somali & English languages
Categories: Complete all category pages (like boats)
Chat UI: Fix message component logic
Architecture: Refactor actions into 3 organized components
Validation: Implement comprehensive form validation
Type Safety: Audit and fix TypeScript definitions
Production: Final build + asset optimization
Payment UI: Integrate payment flow + protect routes
Display: Show 90-day plan users at top of lists
Assistant: Integrate HageAI

3: Deployment
Infrastructure & Deployment
i18n: Implement internationalization
Deployment: Deploy to AWS production environment
Payments: Finalize card processing settings
Monitoring: Set up CloudWatch alerts for performance/errors
AWS Stack:
Amplify (Next.js frontend)
EC2 (Express backend)
RDS (PostgreSQL)
S3 + CloudFront (media)
Cognito (auth)
Route 53 (DNS)
ElastiCache (Redis)
CloudWatch (monitoring)

use this in dev
pm2 logs karaadi-backend-dev --lines 200
