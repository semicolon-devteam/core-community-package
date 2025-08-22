interface DeleteButtonProps {
    onClick: () => void;
    isVisible?: boolean;
  }
  
  export default function DeleteButton({ onClick, isVisible = true }: DeleteButtonProps) {
    if (!isVisible) return null;
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={onClick}
          className="h-9 px-5 py-2 bg-[#545456] rounded-lg inline-flex justify-center items-center"
        >
          <div className="text-center justify-center text-white text-sm font-bold leading-normal">
            삭제
          </div>
        </button>
      </div>
    );
  }