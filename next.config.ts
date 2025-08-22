import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  // webpack 설정 - TypeScript 경로 별칭 지원
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@atoms': path.resolve(__dirname, 'src/component/atoms'),
      '@molecules': path.resolve(__dirname, 'src/component/molecules'),
      '@organisms': path.resolve(__dirname, 'src/component/organisms'),
      '@common': path.resolve(__dirname, 'src/component/common'),
      '@templates': path.resolve(__dirname, 'src/templates'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@page': path.resolve(__dirname, 'src/page'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@util': path.resolve(__dirname, 'src/util'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
    };

    return config;
  },

  // 개발환경에서 /storage 경로를 외부 리소스 서버로 프록시
  async rewrites() {
    // 개발환경이고 NEXT_RESOURCE_URL이 설정된 경우에만 리다이렉트
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_RESOURCE_URL
    ) {
      return [
        {
          source: '/storage/:path*',
          destination: `${process.env.NEXT_RESOURCE_URL}/storage/:path*`,
        },
      ];
    }

    // 프로덕션 환경에서는 리다이렉트 없음
    return [];
  },

  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.semi-colon.space',
        pathname: '/storage/v1/**',
      },
    ],
  },
};

export default nextConfig;
