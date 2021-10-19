export interface MemeResponseDto {
  id: number;
  title: string;
  description?: string;
  imageBytes: string;
  publisherUsername: string;
  publishedOn: string;
}

export interface MemeListResponseDto {
  memes: MemeResponseDto[];
}
