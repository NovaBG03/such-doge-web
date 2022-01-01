export interface MemeResponseDto {
  id: number;
  title: string;
  description?: string;
  imageKey: string;
  publisherUsername: string;
  publishedOn: string;
}

export interface MemeListResponseDto {
  memes: MemeResponseDto[];
}
