interface ReportButtonProps {
    onClick: () => void;
    isVisible?: boolean;
  }
  
  export default function ReportButton({ onClick, isVisible = true }: ReportButtonProps) {
    if (!isVisible) return null;
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={onClick}
          className="h-9 px-5 py-2 bg-red-500 rounded-lg inline-flex justify-center items-center"
        >
          <div className="text-center justify-center text-white text-sm font-bold leading-normal">
            신고
          </div>
        </button>
      </div>
    );
  }