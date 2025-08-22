import { NextRequest, NextResponse } from 'next/server';

// 기본 도메인 설정 (실제 운영 도메인으로 변경 필요)
const BASE_URL = process.env.NEXT_RESOURCE_URL || 'https://yourdomain.com';

export async function GET(request: NextRequest) {
  try {
    // 정적 페이지들
    const staticPages = [
      '',
      'join',
      'partners',
      'me',
      'me/information',
      'me/point/purchase/history',
      'post',
      'board'
    ];

    // 게시판 카테고리들 (실제 데이터베이스에서 가져올 수 있음)
    const boardCategories = [
      'free',
      'humor',
      'news',
      'media',
      'gallery',
      'latest',
    ];

    // 동적 페이지들 - 게시판
    const boardPages = boardCategories.map(category => `/board/${category}`);

    // 모든 URL 조합
    const allPages = [...staticPages, ...boardPages];

    // Sitemap XML 생성
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${getChangeFreq(page)}</changefreq>
    <priority>${getPriority(page)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 페이지별 업데이트 빈도 설정
function getChangeFreq(page: string): string {
  if (page === '' || page === '/') return 'daily';
  if (page.startsWith('/board/')) return 'hourly';
  if (page.startsWith('/post')) return 'hourly';
  if (page.startsWith('/me')) return 'weekly';
  return 'monthly';
}

// 페이지별 우선순위 설정
function getPriority(page: string): string {
  if (page === '' || page === '/') return '1.0';
  if (page.startsWith('/board/')) return '0.8';
  if (page.startsWith('/post')) return '0.8';
  if (page.startsWith('/partners')) return '0.6';
  if (page.startsWith('/me')) return '0.4';
  return '0.5';
}