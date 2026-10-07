# Performance / <3 Second Target

## Implemented optimizations
- Removed third-party Google Fonts from the critical rendering path.
- Uses fast system font fallbacks for immediate text rendering.
- Vite production build uses minified CSS/JS and no source maps.
- HTTP compression is enabled in the Express server.
- Hashed production assets are configured for long-lived browser caching.
- `index.html` remains revalidated so new deployments are picked up.
- Temple directory responses use a short cache with stale-while-revalidate.
- First render uses local fallback temple data so the page is usable while the API request completes.
- No large hero image or video is loaded on the landing page.

## How to verify after deployment
1. Deploy the project.
2. Open the deployed home page in Chrome.
3. Run Lighthouse in DevTools > Lighthouse > Performance.
4. Test Mobile and Desktop separately.
5. Check First Contentful Paint, Largest Contentful Paint and overall Performance.
6. The project requirement is a page-load target under 3 seconds; actual timing depends on hosting, network and database conditions.

## Important
This project is optimized for the target, but no code-only change can guarantee a sub-3-second result on every device/network. The final deployed URL must be measured.
