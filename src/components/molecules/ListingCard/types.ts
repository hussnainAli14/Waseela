export type ListingCardVariant = 'default' | 'cta';

export interface ListingCardProps {
  title: string;
  category: string;
  location: string;
  rating: number | string;
  reviews: number | string;
  verified?: boolean;
  imageUri: string;
  variant?: ListingCardVariant;
  ctaLabel?: string;
  onPress?: () => void;
  onPressCta?: () => void;
}

