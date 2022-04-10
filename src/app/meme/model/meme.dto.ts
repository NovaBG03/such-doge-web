export interface MemeDto {
  id: number,
  title: string,
  description?: string,
  imageKey: string,
  publisherUsername: string,
  publishedOn: string,
  approved?: boolean,
  donations: number
}

export interface MemePageResponseDto {
  memes: MemeDto[],
  totalCount: number
}
