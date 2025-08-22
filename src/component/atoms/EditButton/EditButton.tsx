interface EditButtonProps {
    onClick: () => void;
    isVisible?: boolean;
  }
  
  export default function EditButton({ onClick, isVisible = true }: EditButtonProps) {
    if (!isVisible) return null;
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={onClick}
          className="h-9 px-5 py-2 bg-[#FFB74D] rounded-lg inline-flex justify-center items-center"
        >
          <div className="text-center justify-center text-white text-sm font-bold leading-normal">
            수정
          </div>
        </button>
      </div>
    );
  }