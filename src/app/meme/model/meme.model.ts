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

export interface MemePage {
  memes: Meme[];
  totalCount: number;
}

export interface MemeFilter {
  publishFilter?: MemePublishType,
  orderFilter?: MemeOrderFilter,
  publisher?: string
}

export enum MemePublishType {
  ALL = `ALL`,
  APPROVED = 'APPROVED',
  PENDING = 'PENDING'
}

export enum MemeOrderFilter {
  NEWEST = "NEWEST", // all post, first newest
  OLDEST = "OLDEST", // all post, first oldest
  LATEST_TIPPED = "LATEST_TIPPED", // all post, first with most recent donations
  MOST_TIPPED = "MOST_TIPPED", // all post, first with most donations
  TOP_TIPPED_LAST_3_DAYS = "TOP_TIPPED_LAST_3_DAYS", // only with donation last 3 days, first with most donations
  TOP_TIPPED_LAST_WEEK = "TOP_TIPPED_LAST_WEEK", // only with donation last 7 days, first with most donations
  TOP_TIPPED_LAST_MONTH = "TOP_TIPPED_LAST_MONTH" // only with donation last 30 days, first with most donations
}
