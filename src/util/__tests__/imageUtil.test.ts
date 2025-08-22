/**
 * @jest-environment jsdom
 */

import { normalizeImageSrc, optimizeImageSrc } from '../imageUtil';

// process.env mock
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('normalizeImageSrc', () => {
  it('NEXT_PUBLIC_RESOURCE_URL과 NEXT_PUBLIC_SUPABASE_URL이 설정되지 않은 경우 원본 URL을 반환해야 함', () => {
    delete process.env.NEXT_PUBLIC_RESOURCE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    const src = 'http://localhost:3001/images/banner.png';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe(src);
  });

  it('NEXT_PUBLIC_RESOURCE_URL로 시작하는 URL을 상대경로로 변환해야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    
    const src = 'http://localhost:3001/images/banner.png';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe('/images/banner.png');
  });

  it('NEXT_PUBLIC_SUPABASE_URL로 시작하는 URL을 상대경로로 변환해야 함', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.semi-colon.space';
    
    const src = 'https://supabase.semi-colon.space/storage/v1/object/public/bucket/image.jpg';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe('/storage/v1/object/public/bucket/image.jpg');
  });

  it('NEXT_PUBLIC_RESOURCE_URL로 시작하는 URL이지만 상대경로 부분이 /로 시작하지 않는 경우 /를 추가해야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001/';
    
    const src = 'http://localhost:3001/images/banner.png';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe('/images/banner.png');
  });

  it('이미 상대경로인 경우 변경하지 않아야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    
    const src = '/icons/user.svg';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe('/icons/user.svg');
  });

  it('다른 도메인의 URL인 경우 변경하지 않아야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.semi-colon.space';
    
    const src = 'https://example.com/image.jpg';
    const result = normalizeImageSrc(src);
    
    expect(result).toBe('https://example.com/image.jpg');
  });

  it('빈 문자열이나 null/undefined인 경우 원본을 반환해야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    
    expect(normalizeImageSrc('')).toBe('');
    expect(normalizeImageSrc(null as any)).toBe(null);
    expect(normalizeImageSrc(undefined as any)).toBe(undefined);
  });

  it('문자열이 아닌 타입인 경우 원본을 반환해야 함', () => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    
    const numberInput = 123 as any;
    const objectInput = { url: 'test' } as any;
    
    expect(normalizeImageSrc(numberInput)).toBe(numberInput);
    expect(normalizeImageSrc(objectInput)).toBe(objectInput);
  });
});

describe('optimizeImageSrc', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_RESOURCE_URL = 'http://localhost:3001';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.semi-colon.space';
  });

  it('일반 이미지는 상대경로 변환만 해야 함', () => {
    const src = 'http://localhost:3001/icons/logo.png';
    const result = optimizeImageSrc(src);
    
    expect(result).toBe('/icons/logo.png');
  });

  it('Supabase 이미지는 상대경로 변환 + 최적화를 적용해야 함', () => {
    const src = 'http://localhost:3001/storage/v1/object/public/images/photo.jpg';
    const result = optimizeImageSrc(src, 'lg', 80);
    
    expect(result).toBe('/storage/v1/render/image/public/images/photo.jpg?width=480&quality=80');
  });

  it('size가 undefined인 경우 Supabase 최적화를 적용하지 않아야 함', () => {
    const src = 'http://localhost:3001/storage/v1/object/public/images/photo.jpg';
    const result = optimizeImageSrc(src);
    
    expect(result).toBe('/storage/v1/object/public/images/photo.jpg');
  });

  it('Supabase URL이 아닌 경우 size가 있어도 최적화하지 않아야 함', () => {
    const src = 'http://localhost:3001/images/regular-image.jpg';
    const result = optimizeImageSrc(src, 'md', 90);
    
    expect(result).toBe('/images/regular-image.jpg');
  });

  it('실제 Supabase URL 패턴을 올바르게 처리해야 함', () => {
    const src = 'https://supabase.semi-colon.space/storage/v1/object/public/bucket/image.jpg';
    const result = optimizeImageSrc(src, 'md', 75);
    
    expect(result).toBe('/storage/v1/render/image/public/bucket/image.jpg?width=240&quality=75');
  });
});