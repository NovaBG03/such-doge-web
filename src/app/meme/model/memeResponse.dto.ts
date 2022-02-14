export interface MemeResponseDto {
  id: number;
  title: string;
  description?: string;
  imageKey: string;
  publisherUsername: string;
  publishedOn: string;
  approved?: boolean
}

export interface MemePageResponseDto {
  memes: MemeResponseDto[];
  totalCount: number;
}
