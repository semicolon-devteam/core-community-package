import CustomSelect, { SelectOption } from '@atoms/CustomSelect';
import { useReportCommand } from "@hooks/commands/useReportCommand";
import { useEffect, useState } from "react";

interface ReportTypeService {
  code: string;
  name: string;
  display_order: number;
}

export default function ReportModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  commentId,
  writerId
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (commentId: number, reasonId: string, description: string, writerId: number) => void,
  commentId: number,
  writerId: number
}) {

  const [selectedReason, setSelectedReason] = useState('');
  const [reasons, setReasons] = useState<{ id: string; reason: string }[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if(isOpen) {
      // 모달 열리면 신고사유 가져오기
      useReportCommand().getReportTypes().then((res) => {
        if(res.successOrNot === "Y" && res.data) {
          setReasons(((res.data as unknown) as ReportTypeService[]).map((item) => ({
            id: item.code,
            reason: item.name
          })));
        }
      });
    } else {
      // 모달 닫힐 때 상태 초기화
      setSelectedReason('');
      setDescription('');
    }
  }, [isOpen]);

  if(!isOpen) {

    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* 모달 내용 */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[500px]">
        {/* 우측 상단 X 버튼 */}
        <button onClick={onClose} className="absolute right-4 top-4">X</button>
        
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4">신고하기</h2>
        
        {/* 신고 사유 선택 */}
        <CustomSelect<string>
          options={[
            { id: '', label: '신고 사유를 선택하세요', value: '' },
            ...reasons.map(reason => ({
              id: reason.id,
              label: reason.reason,
              value: reason.id
            }))
          ]}
          value={selectedReason}
          onChange={(option) => setSelectedReason(option.value)}
          className="w-full mb-4"
        />
        
        {/* 상세 설명 */}
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            상세 설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-24 resize-none"
            placeholder="신고 사유에 대한 상세 설명을 입력해주세요"
          />
        </div>
        
        {/* 버튼들 */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            닫기
          </button>
          <button 
            onClick={() => onSubmit(commentId, selectedReason, description, writerId)} 
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}