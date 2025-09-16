/**
 * Vite plugin to handle 'use client' directives in Storybook
 */
export function useClientPlugin() {
  return {
    name: 'use-client-plugin',
    transform(code: string, id: string) {
      // .tsx, .ts, .jsx, .js 파일에서 'use client' 지시어 제거
      if (/\.(tsx?|jsx?)$/.test(id)) {
        // 파일 시작 부분의 'use client' 또는 "use client" 제거
        const transformedCode = code.replace(/^['"]use client['"];?\s*\n?/m, '');
        
        if (transformedCode !== code) {
          return {
            code: transformedCode,
            map: null, // sourcemap 비활성화
          };
        }
      }
      return null;
    },
  };
}