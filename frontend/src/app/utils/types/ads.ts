export interface AdImageData {
  url: string;
  alt?: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  maGaday: boolean;
  isPaid: boolean;
  image: string;
  type: string;
}
