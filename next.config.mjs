import createNextIntlPlugin from 'next-intl/plugin'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['ik.imagekit.io'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
}

const analyzeBundleConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)

// Load user config if exists
const loadUserConfig = async () => {
  try {
    return await import('./v0-user-next.config')
  } catch {
    return null
  }
}

// Merge configurations
const mergeConfig = (baseConfig, userConfig) => {
  if (!userConfig) return baseConfig

  const merged = { ...baseConfig }
  
  Object.entries(userConfig).forEach(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      merged[key] = { ...merged[key], ...value }
    } else {
      merged[key] = value
    }
  })

  return merged
}

// Export final config
export default async () => {
  const userConfig = await loadUserConfig()
  return withNextIntl(mergeConfig(analyzeBundleConfig, userConfig?.default))
}