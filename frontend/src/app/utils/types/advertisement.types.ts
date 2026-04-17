export interface Advertisement {
  createdAt: string | number | Date;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  position: string;
  priority: number;
  clicks: number;
  views: number;
  startDate?: Date;
  endDate?: Date;
}
