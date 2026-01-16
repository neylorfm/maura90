export enum SlideType {
  COVER = 'COVER',
  PHOTO_SHOWCASE = 'PHOTO_SHOWCASE',
  COLLAGE = 'COLLAGE',
  TIMELINE = 'TIMELINE',
  QUOTES = 'QUOTES',
  MULTI_PHOTO = 'MULTI_PHOTO'
}

export interface BaseSlide {
  id: string;
  type: SlideType;
}

export interface CoverSlideData extends BaseSlide {
  type: SlideType.COVER;
  name: string;
  years: string;
  subtitle: string;
  tagline: string;
}

export interface PhotoShowcaseData extends BaseSlide {
  type: SlideType.PHOTO_SHOWCASE;
  image: string;
  year: string;
  location: string;
  decade: string;
  description: string;
  position?: string;
  scale?: number;
}

export interface CollageData extends BaseSlide {
  type: SlideType.COLLAGE;
  title: string;
  subtitle: string;
  images: {
    src: string;
    label: string;
    sublabel: string;
    rotation?: number; // degrees
    highlight?: boolean;
    position?: string;
    scale?: number;
  }[];
  stats: {
    label: string;
    value: string;
  }[];
}

export interface MultiPhotoData extends BaseSlide {
  type: SlideType.MULTI_PHOTO;
  title: string;
  subtitle: string;
  images: {
    src: string;
    position?: string;
    scale?: number;
  }[];
}

export interface TimelineEvent {
  year: string;
  image: string;
  description: string;
  position?: string;
  scale?: number;
}

export interface TimelineData extends BaseSlide {
  type: SlideType.TIMELINE;
  title: string;
  subtitle: string;
  events: TimelineEvent[];
}

export interface Quote {
  author: string;
  relation: string;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  image?: string;
}

export interface QuotesData extends BaseSlide {
  type: SlideType.QUOTES;
  title: string;
  subtitle: string;
  centralImage: string;
  position?: string;
  scale?: number;
  quotes: Quote[];
  floatingImages?: {
    src: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    size: number; // pixels (or relative scale)
  }[];
}

export type SlideData =
  | CoverSlideData
  | PhotoShowcaseData
  | CollageData
  | TimelineData
  | QuotesData
  | MultiPhotoData;