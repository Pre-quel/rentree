export interface PasteDocument {
  _id: string;
  content: string;
  editCode?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ApiError {
  error: string;
  details?: any;
}