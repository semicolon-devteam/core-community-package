import { useUserCommands } from '@hooks/commands/useUserCommands';
import { FileAttachment } from '../../../types/post';
import fileService from '@services/fileService';
import { normalizeImageSrc } from '@util/imageUtil';
import Image from "next/image";

import { useState } from 'react';

export default function ProfileChanger({
  setShowProfileChange,
  originalProfileImage,
}: {
  setShowProfileChange: (showProfileChange: boolean) => void;
  originalProfileImage: string;
}) {
  const [isProfileChanged, setIsProfileChanged] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<FileAttachment | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(
    originalProfileImage
  );

  const { updateUserProfile, refreshMyInfo } = useUserCommands();

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 프로필 이미지는 즉시 업로드가 필요하므로 fileService 직접 사용 (동기 방식)
        const response = await fileService.uploadFile(file, {
          doWaterMark: false,
        });
        
        if (response.successOrNot === 'Y' && response.data) {
          const fileData: FileAttachment = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fullPath: response.data.fullPath,
            uuid: response.data.uuid,
            url: response.data.url,
            thumbnailUrl: response.data.thumbnailUrl,
          };
          
          setProfileImage(fileData.url);
          setUploadedFile(fileData);
          setIsProfileChanged(true);
        } else {
          console.error('프로필 이미지 업로드 실패:', response.message);
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 중 오류:', error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (uploadedFile) {
      const response = await updateUserProfile(uploadedFile?.url);
      console.log(response);

      if (response.successOrNot === 'Y') {
        setShowProfileChange(false);
        refreshMyInfo();
      }
    }
  };

  return (
    <div className="min-w-[300px] bg-white rounded-2xl shadow-custom border border-border-default overflow-hidden p-5 whitespace-nowrap ">
      <div className="flex flex-col items-center justify-between gap-5">
        <div className="flex items-center justify-between w-full pb-5 border-b-2 border-gray-900">
          <div className="text-text-primary text-base font-medium font-nexon ">
            프로필 변경
          </div>
          <Image
            src={normalizeImageSrc("/icons/x.svg")}
            alt="닫기"
            onClick={() => setShowProfileChange(false)}
            width={24}
            height={24}
            className="cursor-pointer w-6 h-6"
          />
        </div>
        <div className=" text-text-secondary text-sm font-normal font-nexon flex flex-col items-center justify-center gap-5">
          <div className="overflow-hidden rounded-full w-[120px] h-[120px] bg-cover border border-border-default flex items-center justify-center">
            <Image
              src={normalizeImageSrc(profileImage || '/images/main/user-profile.png')}
              alt="유저 프로필"
              width={120}
              height={120}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <label className="cursor-pointer rounded-lg border border-border-default py-2 px-5 font-bold text-md text-black">
              <input
                type="file"
                accept=".jpg,.png"
                className="hidden"
                onChange={handleSelectFile}
              />
              파일선택
            </label>
            <div className="text-text-secondary text-sm font-normal font-nexon text-center">
              {uploadedFile?.fileName || '등록된 파일이 없습니다.'}
            </div>
          </div>
          <div className="text-text-tertiary text-md font-normal font-nexon text-center pb-5 border-b-2 border-gray-200">
            프로필 이미지는 [jpg, png]파일만 가능하며,
            <br />
            등록시 120x120 사이즈로 적용됩니다.
          </div>
          <div className="flex items-center justify-between w-full gap-5">
            <div
              className="w-full cursor-pointer rounded-lg border border-border-default py-3 px-5 font-bold text-md text-center text-white bg-tertiary"
              onClick={() => setShowProfileChange(false)}
            >
              취소
            </div>
            <div
              className={`w-full rounded-lg border border-border-default py-3 px-5 font-bold text-md text-center text-white 
                                ${
                                  isProfileChanged
                                    ? 'bg-primary cursor-pointer'
                                    : 'bg-secondary cursor-not-allowed'
                                }`}
              onClick={isProfileChanged ? handleUpdateProfile : undefined}
            >
              등록
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
