/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add runtime check to ensure environment variables are available
  env: {
    NEXT_PUBLIC_ENV_CHECK: 'true',
  },
  // Increase serverless function timeout if needed
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutInSeconds: 60,
  },
  // Enable more verbose logging in production
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Customize error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig;
