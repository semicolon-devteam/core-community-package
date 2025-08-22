"use client";

import LinkWithLoader from "@common/LinkWithLoader";
import { useGlobalLoader } from "@hooks/common";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

type Banner = {
    id: string;
    alt: string;
    link: string;
    image: string;
}

export default function BannerLists({banners, columns}: {banners: Banner[], columns: number}) {
    const { showLoader } = useGlobalLoader();

    return (    
        <div className={`grid grid-cols-${columns} gap-2`}>
            {banners.map((banner) => (
                <LinkWithLoader 
                    key={banner.id} 
                    href={banner.link}
                >
                    <Image className="w-full h-full object-cover" src={normalizeImageSrc(banner.image)} alt={banner.alt} fill sizes="(max-width: 768px) 50vw, 25vw" />
                </LinkWithLoader>
            ))}
        </div>
    )
}