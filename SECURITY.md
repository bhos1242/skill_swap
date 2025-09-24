# 🚨 Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The Skill Swap team takes security seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@skillswap.platform**

Include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 48 hours
2. **Investigation**: We'll investigate and validate the issue
3. **Resolution**: We'll work on a fix and coordinate disclosure
4. **Credit**: We'll credit you in our security acknowledgments (if desired)

### Security Considerations

#### Authentication & Authorization
- Google OAuth is used for authentication
- Session management via NextAuth.js
- Profile visibility controls (public/private)

#### Data Protection
- Environment variables for sensitive data
- Database connection strings secured
- No sensitive data in client-side code

#### Input Validation
- Server-side validation on all API endpoints
- Prisma ORM for SQL injection prevention
- XSS protection via React's built-in sanitization

#### Common Vulnerabilities We Monitor

- **SQL Injection**: Prevented via Prisma ORM
- **XSS**: Mitigated by React and input sanitization
- **CSRF**: Protected by NextAuth.js CSRF tokens
- **Authentication Bypass**: Multiple layers of auth checks
- **Data Exposure**: Proper API access controls

### Best Practices for Contributors

1. **Never commit secrets** - Use .env.local for sensitive data
2. **Validate all inputs** - Both client and server-side
3. **Use parameterized queries** - Always use Prisma for database access
4. **Implement proper authorization** - Check user permissions
5. **Sanitize outputs** - Prevent XSS attacks
6. **Use HTTPS** - Always in production
7. **Keep dependencies updated** - Regularly update packages

### Security Headers

We implement the following security headers:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### Dependency Security

We use the following tools to monitor dependencies:

- `npm audit` - Regular dependency vulnerability scanning
- Dependabot - Automated dependency updates
- Regular manual security reviews

### Environment Security

#### Development
- Use `.env.local` for local development
- Never commit `.env*` files
- Use strong, unique secrets

#### Production
- Environment variables via Vercel
- Database connections over SSL
- Regular security updates

## Security Champions

Current security champions for this project:

- **Lead**: @bhos1242
- **Community**: All contributors are encouraged to report security issues

## Acknowledgments

We thank the following researchers for responsibly disclosing vulnerabilities:

*(None yet - be the first!)*

---

**Remember**: When in doubt about security, ask! It's better to be safe than sorry.

For general questions about this policy, email: security@skillswap.platform
