import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_RESOURCE_URL || 'https://yourdomain.com';

export async function GET(request: NextRequest) {
  try {
    const allUrls: SitemapUrl[] = [];

    // 정적 페이지들
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: 'join', priority: '0.6', changefreq: 'monthly' },
      { url: 'partners', priority: '0.6', changefreq: 'weekly' },
      { url: 'me', priority: '0.4', changefreq: 'weekly' },
      { url: 'me/information', priority: '0.4', changefreq: 'monthly' },
      { url: 'me/point/purchase/history', priority: '0.4', changefreq: 'weekly' },
      { url: 'post', priority: '0.8', changefreq: 'hourly' },
      { url: 'board', priority: '0.8', changefreq: 'hourly' },
    ].map(page => ({
      ...page,
      url: `/${page.url}`  // URL에 leading slash 추가
    }));

    allUrls.push(...staticPages);

    // 게시판 페이지들
    const boardCategories = [
      'free', 'humor', 'news', 'media', 'gallery', 'latest'
    ];

    // 최근 게시글들 (최대 100개)
    try {
      const postsResponse = await fetch(`${BASE_URL}/api/post/latest?limit=100`, {
        next: { revalidate: 3600 } // 1시간 캐시
      });
      
      if (!postsResponse.ok) {
        throw new Error(`Failed to fetch posts: ${postsResponse.statusText}`);
      }

      const postsData = await postsResponse.json();
      
      if (Array.isArray(postsData?.data)) {
        postsData.data.forEach((post: any) => {
          if (post?.id) {
            allUrls.push({
              url: `/post/${post.id}`,
              priority: '0.7',
              changefreq: 'weekly',
              lastmod: post.updated_at || post.created_at || new Date().toISOString()
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch posts for sitemap:', error);
      // 게시글 데이터 fetch 실패는 치명적이지 않으므로 계속 진행
    }

    // 파트너 페이지들
    try {
      const partnersResponse = await fetch(`${BASE_URL}/api/partners`, {
        next: { revalidate: 86400 } // 24시간 캐시
      });
      
      if (!partnersResponse.ok) {
        throw new Error(`Failed to fetch partners: ${partnersResponse.statusText}`);
      }

      const partnersData = await partnersResponse.json();
      
      // partners 데이터가 배열인지 확인
      if (Array.isArray(partnersData)) {
        partnersData.forEach((partner: any) => {
          if (partner?.id) {
            allUrls.push({
              url: `/partners/${partner.id}`,
              priority: '0.6',
              changefreq: 'monthly',
              lastmod: partner.updated_at || partner.created_at || new Date().toISOString()
            });
          }
        });
      } else if (Array.isArray(partnersData?.data)) {
        // data 프로퍼티 내에 배열이 있는 경우
        partnersData.data.forEach((partner: any) => {
          if (partner?.id) {
            allUrls.push({
              url: `/partners/${partner.id}`,
              priority: '0.6',
              changefreq: 'monthly',
              lastmod: partner.updated_at || partner.created_at || new Date().toISOString()
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch partners for sitemap:', error);
      // 파트너 데이터 fetch 실패는 치명적이지 않으므로 계속 진행
    }

    // Sitemap XML 생성
    const sitemap = generateSitemapXML(allUrls);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Advanced sitemap generation error:', error);
    // 최소한의 정적 sitemap 반환
    const fallbackUrls = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/post', priority: '0.8', changefreq: 'hourly' },
      { url: '/partners', priority: '0.6', changefreq: 'weekly' },
    ];
    const fallbackSitemap = generateSitemapXML(fallbackUrls);
    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

interface SitemapUrl {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

function generateSitemapXML(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ url, priority, changefreq, lastmod }) => `  <url>
    <loc>${BASE_URL}${url.startsWith('/') ? url : `/${url}`}</loc>
    <lastmod>${lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}