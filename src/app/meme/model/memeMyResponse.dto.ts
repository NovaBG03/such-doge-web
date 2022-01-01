export interface MemeMyResponseDto {
  id: number;
  title: string;
  description?: string;
  imageKey: string;
  publisherUsername: string;
  publishedOn: string;
  approved: boolean
}

export interface MemeMyListResponseDto {
  memes: MemeMyResponseDto[];
}
