import type { PaymentMethod } from "@/app/(storeFront)/(pages)/(managment)/payment/constants";

export interface UsePaymentProps {
  item: any;
  plan: any;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  setPhoneError: (msg: string) => void;
}
