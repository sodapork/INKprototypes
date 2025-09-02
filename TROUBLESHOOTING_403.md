# Troubleshooting 403 Forbidden Error

## Problem
You're getting a repeated 403 error when trying to use the issues management tool:
```
POST https://in-kprototypes.vercel.app/api/openai 403 (Forbidden)
```

## Possible Causes & Solutions

### 1. CORS Issues
**Symptoms**: 403 error with CORS-related messages in console
**Solution**: Added CORS headers to API endpoints

### 2. Vercel Function Deployment
**Check**: Verify your API functions are properly deployed
**Steps**:
- Go to your Vercel dashboard
- Check if the `/api/openai` function shows as "Ready"
- Look for any deployment errors in the logs

### 3. Environment Variables
**Check**: Verify `OPENAI_API_KEY` is set in Vercel
**Steps**:
- Go to Vercel dashboard → Project Settings → Environment Variables
- Ensure `OPENAI_API_KEY` exists and has a valid value
- Redeploy after adding/updating env vars

### 4. Vercel Project Configuration
**Check**: Look for project-level restrictions
**Steps**:
- Check Vercel project settings for any access controls
- Verify the project is not in maintenance mode
- Check if there are IP restrictions

### 5. Rate Limiting
**Symptoms**: 403 errors after multiple requests
**Solution**: Check Vercel usage limits and rate limiting

### 6. Function Code Issues
**Check**: Verify the API function code is correct
**Current Status**: ✅ CORS headers added
**Current Status**: ✅ Error handling improved

## Debug Steps

1. **Load the page with debug script** - The `test-api-debug.js` will auto-run tests
2. **Check browser console** - Look for detailed error messages
3. **Test individual endpoints** - Use the debug buttons to test each API
4. **Check Vercel logs** - Look at function execution logs

## Test Endpoints

- `/api/test` - Simple test endpoint (should always work)
- `/api/openai` - OpenAI integration (requires API key)
- `/api/wordpress` - WordPress integration (requires WP credentials)

## Next Steps

1. Deploy the updated API functions with CORS headers
2. Test with the debug script
3. Check Vercel function logs for specific error details
4. Verify environment variables are properly set

## Common Vercel Issues

- **Cold starts**: First request might be slow
- **Function timeout**: Default is 10 seconds
- **Memory limits**: Default is 1024MB
- **Request size**: Default is 4.5MB

## Contact Support

If the issue persists:
1. Check Vercel function logs
2. Verify all environment variables
3. Test with the debug script
4. Check Vercel project status
