// custom.d.ts
declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  function withPWA(config: NextConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}