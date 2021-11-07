export interface MemeMyResponseDto {
  id: number;
  title: string;
  description?: string;
  imageBytes: string;
  publisherUsername: string;
  publishedOn: string;
  approved: boolean
}

export interface MemeMyListResponseDto {
  memes: MemeMyResponseDto[];
}
