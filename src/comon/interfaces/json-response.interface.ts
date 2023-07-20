export interface JsonResponse<T = unknown> {
  code: number;
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
}
