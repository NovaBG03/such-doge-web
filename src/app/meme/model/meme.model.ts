import {SafeUrl} from "@angular/platform-browser";

export interface Meme {
  id: number;
  title: string;
  description?: string;
  imageUrl: SafeUrl;
  publisherUsername: string;
  publishedOn: Date;
  isApproved?: boolean
}
