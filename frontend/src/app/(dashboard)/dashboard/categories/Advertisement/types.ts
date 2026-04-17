export interface AdFormData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  position: string;
  priority: number;
  isActive: boolean;
  userId: string;
}

export interface AdItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  position: string;
  priority: number;
  isActive: boolean;
  userId?: string;
  clicks?: number;
  views?: number;
}

export const emptyForm = (position: string, userId: string): AdFormData => ({
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  link: "",
  buttonText: "Learn More",
  position,
  priority: 1,
  isActive: true,
  userId,
});
