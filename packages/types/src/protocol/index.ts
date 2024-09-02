
export interface AppError extends Error {
  type: string;
  message: string;
}

export type JSONDate = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
