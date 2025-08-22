export default function Footer() {
  return (
    <footer className="w-full h-auto py-6 bg-footer flex">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* 로고 영역 - 모바일에서는 중앙, 데스크탑에서는 왼쪽 */}
          <div className="mb-4 md:mb-0 order-1 md:order-1">
            <div className="px-6 py-2 rounded inline-flex justify-center items-center">
              <div className="text-center text-white text-base font-bold font-nexon">
                Logo
              </div>
            </div>
          </div>

          {/* 오른쪽 부분을 담는 컨테이너 */}
          <div className="flex flex-col items-center md:items-end order-3 md:order-2">
            {/* 메뉴 링크 */}
            <div className="mb-3 md:mb-4 flex justify-center items-center gap-2">
              <div className="w-[60px] text-center text-text-secondary text-sm font-medium font-nexon">
                문의하기
              </div>
              <div className="w-3 h-[0px] origin-top-left rotate-90 border border-border-default"></div>
              <div className="w-[80px] text-center text-text-secondary text-sm font-medium font-nexon">
                모바일버전
              </div>
            </div>

            {/* 저작권 정보 */}
            <div className="text-text-secondary text-[13px] font-medium font-nexon text-center md:text-right">
              Copyright ⓒ 2024 Site Name All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
