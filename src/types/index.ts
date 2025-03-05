export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RequestValidationResponse extends BaseResponse {
  errors?: ValidationError[];
}
