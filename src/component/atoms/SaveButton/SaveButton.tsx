interface SaveButtonProps {
    onClick: () => void;
    isVisible?: boolean;
  }
  
  export default function SaveButton({ onClick, isVisible = true }: SaveButtonProps) {
    if (!isVisible) return null;
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={onClick}
          className="h-9 px-5 py-2 bg-orange-500 rounded-lg inline-flex justify-center items-center"
        >
          <div className="text-center justify-center text-white text-sm font-bold leading-normal">
            저장
          </div>
        </button>
      </div>
    );
  }