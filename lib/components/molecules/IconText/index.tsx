import { normalizeImageSrc } from '@util/imageUtil';
import Image from "next/image";

export default function IconText({ icon, text }: { icon: string, text: string }) {
    return (
        <div className="flex items-center gap-2">
            <Image src={normalizeImageSrc(icon)} alt="icon" width={24} height={24} className="w-6 h-6" />
            <span>{text}</span>
        </div>
    );
}