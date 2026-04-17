export interface CreatedPayload {
  id: string | number;
  [key: string]: unknown;
}

export interface CarState {
  items: CreatedPayload[];
  selectedItem: CreatedPayload | null;
  loading: boolean;
  error: string | null;
}
