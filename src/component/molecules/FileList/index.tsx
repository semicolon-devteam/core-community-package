import type { FileAttachment } from "@model/post";
import { normalizeImageSrc } from '@util/imageUtil';
import Image from "next/image";

interface FileListProps {
  files: File[];
  fileAttachments: FileAttachment[];
  localFilePreviews: string[];
  onRemoveFile: (index: number) => void;
  onRemoveAttachment: (index: number) => void;
  showThumbnail?: boolean; // 썸네일 표시 여부 (기본값: true)
  columns?: number; // 컬럼 개수 (기본값: 2)
}

export default function FileList({
  files,
  fileAttachments,
  localFilePreviews,
  onRemoveFile,
  onRemoveAttachment,
  showThumbnail = true,
  columns = 2,
}: FileListProps) {

  // 컬럼 개수에 따른 grid 클래스 생성
  const getGridClass = () => {
    const baseClass = "grid gap-2";
    if (columns === 1) return `${baseClass} grid-cols-1`;
    if (columns === 2) return `${baseClass} grid-cols-1 sm:grid-cols-2`;
    if (columns === 3) return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
    if (columns === 4) return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
    return `${baseClass} grid-cols-1 sm:grid-cols-2`;
  };


  return (
    <div className={getGridClass()}>
      {/* 기존 첨부파일 렌더링 */}
      {fileAttachments.map((attachment, idx) => (
        <div
          key={attachment.uuid}
          className="rounded-lg border border-border-default overflow-hidden flex flex-col"
        >
          {showThumbnail && (
            <div
              className={`w-full ${
                attachment.fileType?.startsWith("image/") ? "h-28" : "h-12"
              } bg-[#f8f8fb] flex justify-center items-center p-2`}
            >
              <img
                src={
                  attachment.fileType?.startsWith("image/")
                    ? attachment.url
                    : "/icons/file-icon.svg"
                }
                alt={attachment.fileName}
                className={`${
                  attachment.fileType?.startsWith("image/")
                    ? "h-full max-h-28 max-w-full object-contain"
                    : "h-12 w-12 object-contain"
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/icons/file-icon.svg";
                }}
              />
            </div>
          )}
          <div className="flex justify-center bg-white gap-2">
            <div className="text-text-primary text-xs font-medium font-nexon text-center text-nowrap px-6 bg-gray-200 flex justify-center items-center w-20">
              파일 {idx + 1}
            </div>
            <div className="bg-white flex justify-between items-center w-full overflow-hidden">
              <div className="flex-1 flex gap-1 items-center overflow-hidden">
                <span className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate text-ellipsis">
                  {attachment.fileName}
                </span>
                <span className="text-text-secondary text-xs font-normal font-nexon flex-none">
                  {(attachment.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={() => onRemoveAttachment(idx)}
                className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full hover:bg-gray-300 h-8 w-8 mr-2"
                aria-label="제거"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    fill="#545456"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 새로 추가된 파일 렌더링 */}
      {files.map((file, index) => (
        <div
          key={file.name + index}
          className="rounded-lg border border-border-default overflow-hidden flex flex-col"
        >
          {showThumbnail && (
            <div
              className={`w-full ${
                file.type.startsWith("image/") ? "h-28" : "h-12"
              } bg-[#f8f8fb] flex justify-center items-center p-2`}
            >
              <Image
                src={normalizeImageSrc(localFilePreviews[index] || "/icons/file-icon.svg")}
                alt={file.name}
                fill
                className={`${
                  file.type.startsWith("image/")
                    ? "object-contain"
                    : "object-contain w-12 h-12"
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/icons/file-icon.svg";
                }}
              />
            </div>
          )}
          <div className="flex  justify-center  bg-white gap-2">
            <div className="text-text-primary text-xs font-medium font-nexon text-center text-nowrap px-6 bg-gray-200 flex justify-center items-center w-20 ">
              파일 {fileAttachments.length + index + 1}
            </div> 
            <div className=" bg-white flex justify-between items-center w-full overflow-hidden">
                <div className="flex-1 flex gap-1 items-center overflow-hidden">
                    <span className="text-neutral-900 text-xs sm:text-sm font-medium font-nexon truncate text-ellipsis">
                    {file.name}
                    </span>
                    <span className="text-text-secondary text-xs font-normal font-nexon flex-none">
                    {(file.size / 1024).toFixed(1)} KB
                    </span>
                </div>
                <button
                    onClick={() => onRemoveFile(index)}
                    className="ml-2 p-1 bg-[#f8f8fb] flex justify-center items-center rounded-full hover:bg-gray-300 h-8 w-8 mr-2"
                    aria-label="제거"
                >
                    <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="#545456"
                    />
                    </svg>
                </button>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 