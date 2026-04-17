import type { ID } from "./common.types";

export interface JobCreatedPayload {
  id: ID;
  [key: string]: unknown;
}

export interface JobState {
  items: JobCreatedPayload[];
  selectedItem: JobCreatedPayload | null;
  loading: boolean;
  error: string | null;
}
