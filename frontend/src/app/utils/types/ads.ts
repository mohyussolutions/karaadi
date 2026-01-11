export interface AdImageData {
  url: string;
  title: string;
  description: string;
  link: string;
}

export interface AdvertisementCardProps {
  images: AdImageData[];
}
