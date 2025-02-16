/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'tasis-al-bina.onrender.com',
      },
    ],
  },
  env: {
    API_BASE_URL: 'https://tasis-al-bina.onrender.com',
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  }
}

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
  return mergeConfig(nextConfig, userConfig?.default)
}
