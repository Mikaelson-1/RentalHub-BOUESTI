# RentalHub Monitoring Setup Guide

This guide covers setting up error tracking, performance monitoring, and alerting for RentalHub.

---

## 1. Sentry Error Tracking & Performance Monitoring

Sentry captures all errors, exceptions, and performance issues in production.

### Setup Steps:

#### Step 1: Create a Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project → Select "Next.js"

#### Step 2: Get Your Sentry DSN
After creating the project:
1. Go to **Settings** → **Client Keys (DSN)**
2. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/12345`)

#### Step 3: Configure Environment Variables in Vercel

Add these to your Vercel project:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-from-sentry
SENTRY_ORG=your-sentry-organization-slug
SENTRY_PROJECT=your-sentry-project-slug
```

**To get SENTRY_AUTH_TOKEN:**
1. Go to Sentry Settings → **Auth Tokens**
2. Create a new token with `project:releases` and `org:read` scopes
3. Copy and paste it

#### Step 4: Deploy
```bash
vercel deploy --prod
```

The app will automatically:
- ✅ Capture all unhandled exceptions
- ✅ Track performance (10% sample rate in production)
- ✅ Record session replays for errors
- ✅ Upload source maps for better error tracking

---

### What Gets Tracked:

**Errors:**
- Unhandled exceptions
- API errors
- Server-side errors
- Client-side JavaScript errors
- Network failures

**Performance:**
- Page load times
- API response times
- Database query times
- Component render times

**Session Replay:**
- Video-like playback of user sessions when errors occur
- Helps debug issues in production
- Privacy-friendly (masks sensitive data)

---

## 2. Performance Alerts

### Alert Rules in Sentry

#### Create an Alert for High Error Rate:
1. Go to **Alerts** → **Create Alert**
2. Set conditions:
   - **If** `error count >= 10`
   - **For** `5 minutes`
   - **Then** `Send to Slack/Email`

#### Create an Alert for Slow Responses:
1. **If** `p95(http.response_time) > 1000ms`
2. **For** `10 minutes`
3. **Then** `Notify team`

#### Create an Alert for High Failure Rate:
1. **If** `failure rate > 5%`
2. **For** `5 minutes`
3. **Then** `Notify team`

### Integration with Slack (Recommended)
1. Go to **Integrations** → Find **Slack**
2. Connect your Slack workspace
3. Select channel for alerts
4. Alerts will automatically post to Slack

---

## 3. Database Backup Verification

Your database is hosted on Neon. Backups are automatic.

### Verify Backups:
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Backups**
4. Verify automatic daily backups are enabled

### Backup Configuration:
- **Frequency:** Daily
- **Retention:** 7 days (free tier)
- **Storage:** Automatic

### To Restore from Backup:
1. In Neon Console → **Backups**
2. Click **Restore** on any backup
3. Restore point will be created (usually takes 2-5 minutes)

### Manual Backup Best Practice:
Before major deployments, create a manual backup:
```bash
# Export database dump
pg_dump DATABASE_URL > backup-$(date +%Y-%m-%d).sql
```

---

## 4. Monitoring Dashboard

### Sentry Dashboard Metrics:

**Homepage:**
- Error rate trends
- Performance graphs
- Affected users
- Recent issues

**Issues Page:**
- List of all errors
- Click to see details
- Stack traces
- Affected users

**Performance Page:**
- Page load times
- API endpoint performance
- Database queries
- Transaction traces

### Key Metrics to Monitor:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 5% | Investigate immediately |
| p95 Response Time | > 1s | Check database/cache |
| Failed Requests | > 10/min | Scale up or debug |
| Unhandled Exceptions | > 0 | Fix and deploy |

---

## 5. Testing Error Tracking

To test Sentry is working:

### Trigger a Test Error:
1. Create a test endpoint:
```typescript
// src/app/api/test/error/route.ts
export async function GET() {
  throw new Error("Test error from RentalHub");
}
```

2. Call it: `https://rentalhub.ng/api/test/error`

3. Check Sentry → **Issues** (error should appear in 2-3 seconds)

### Simulate Performance Issue:
```typescript
// Intentional slow endpoint for testing
await new Promise(resolve => setTimeout(resolve, 2000));
return Response.json({ test: "slow" });
```

---

## 6. Monitoring Checklist

- [ ] Sentry account created
- [ ] DSN added to Vercel environment
- [ ] SENTRY_AUTH_TOKEN configured
- [ ] Production deployment completed
- [ ] Test error triggered and verified
- [ ] Slack integration setup
- [ ] Alert rules created
- [ ] Team notified of monitoring
- [ ] Weekly monitoring reviews scheduled

---

## 7. Troubleshooting

**Sentry not capturing errors:**
- Verify `NEXT_PUBLIC_SENTRY_DSN` is set in Vercel
- Check browser console for errors
- Rebuild and redeploy

**Missing source maps:**
- Verify `SENTRY_AUTH_TOKEN` is correct
- Check Sentry organization slug
- Redeploy with `--prod` flag

**Too many alerts:**
- Adjust alert thresholds
- Set up alert routing by issue type
- Create alert rules for critical issues only

---

## 8. Cost Optimization

**Sentry Free Plan:**
- 5,000 error events/month
- 24-hour retention
- Good for small projects

**When to upgrade:**
- > 5,000 errors/month
- Need longer retention
- Want advanced features

**Cost-Saving Tips:**
- Sample errors in production (10%)
- Use allowed URLs to ignore certain errors
- Archive old issues

---

## 9. Next Steps

1. **Short-term:** Set up alerts and Slack integration
2. **Medium-term:** Create dashboards for team
3. **Long-term:** Implement error budget tracking

For questions, visit [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
