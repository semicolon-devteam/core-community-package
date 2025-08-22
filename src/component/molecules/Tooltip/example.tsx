import React from 'react';
import Tooltip from './index';

const TooltipExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Tooltip 사용 예시</h1>
      
      {/* 기본 툴팁 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">기본 툴팁</h2>
        <div className="flex space-x-4">
          <Tooltip content="기본 툴팁입니다">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              기본 툴팁
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 위치별 툴팁 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">위치별 툴팁</h2>
        <div className="flex space-x-4">
          <Tooltip content="상단 툴팁" position="top">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              상단
            </button>
          </Tooltip>
          
          <Tooltip content="하단 툴팁" position="bottom">
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              하단
            </button>
          </Tooltip>
          
          <Tooltip content="좌측 툴팁" position="left">
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              좌측
            </button>
          </Tooltip>
          
          <Tooltip content="우측 툴팁" position="right">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              우측
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 커스텀 스타일 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">커스텀 스타일</h2>
        <div className="flex space-x-4">
          <Tooltip 
            content="커스텀 배경색과 텍스트 색상" 
            backgroundColor="#ff6b6b" 
            textColor="#fff"
            position="top"
          >
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              커스텀 색상
            </button>
          </Tooltip>
          
          <Tooltip 
            content="긴 텍스트를 포함한 툴팁입니다. 최대 너비가 설정되어 있어 자동으로 줄바꿈됩니다." 
            backgroundColor="#4ecdc4" 
            textColor="#2c3e50"
            maxWidth={250}
            position="bottom"
          >
            <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
              긴 텍스트
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 지연 시간 설정 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">지연 시간 설정</h2>
        <div className="flex space-x-4">
          <Tooltip content="즉시 표시" delay={0}>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              즉시 표시
            </button>
          </Tooltip>
          
          <Tooltip content="1초 후 표시" delay={1000}>
            <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
              1초 지연
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 비활성화 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">비활성화</h2>
        <div className="flex space-x-4">
          <Tooltip content="표시되지 않음" disabled>
            <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
              비활성화된 툴팁
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TooltipExample;