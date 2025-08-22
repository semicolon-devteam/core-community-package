"use client";

import LinkWithLoader from "@common/LinkWithLoader";
import { useGlobalLoader } from "@hooks/common";
import type { Banner } from "@model/banner";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";


export default function MainBanner({ banners }: { banners: Banner[] }) {
  const { showLoader } = useGlobalLoader();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      {banners && banners.map((e, i) => {
        return (
          <div
            key={`mainBannerItems-${i}`}
            className="aspect-[308/97] relative rounded-lg overflow-hidden"
          >
            <LinkWithLoader 
              href={e.link_url} 
              target={e.target_window}
            >
              <Image
                className={
                  `cursor-pointer ${e.is_responsive ? 'w-full h-full' : 'w-auto h-auto'} object-cover`
                }
                src={normalizeImageSrc(e.image_url || "")}
                alt={e.description}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </LinkWithLoader>
          </div>
        );
      })}
    </div>
  );
}
