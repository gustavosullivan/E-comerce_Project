export interface ApiError {
  message: string;
  statusCode?: number;
  field?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
