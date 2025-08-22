export interface Banner {
    id?: number;
    title: string;
    description: string;
    position: string;
    image_url?: string;
    image?: File;
    link_url: string;
    target_window: string;
    start_at: string;
    end_at: string;
    display_order: number;
    target_devices: string[];
    width: number;
    height: number;
    is_responsive: boolean;
    status: string;
    click_count?: number;
}