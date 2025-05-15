import { AxiosError } from "axios";

export function handleError(error: unknown): string {
  console.error(error);

  if (error instanceof AxiosError) {
    const status = error.response?.status || error.request?.status;
    const message = error.response?.data?.message || 
                    error.response?.statusText ||
                    error.message;
    
    return `HTTP Error ${status}: ${message}`;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again later.";
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}