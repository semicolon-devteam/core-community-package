
import type { Banner } from "@model/banner";

export default function BannerContainer({ banners }: { banners: Banner[] }) {
    return (
        <div>
            <h1>Banner Container</h1>
            {banners.map((banner) => (
                <div key={banner.id}>
                    <h2>{banner.title}</h2>
                    <p>{banner.description}</p>
                </div>
            ))}
        </div>
    )
}