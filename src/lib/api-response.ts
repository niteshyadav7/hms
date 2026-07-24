import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function apiError(error: string, status = 400, details?: any) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}
