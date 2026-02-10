
export enum AestheticStyle {
  RUSTIC_DARK = 'Rustic/Dark',
  BRIGHT_MODERN = 'Bright/Modern',
  SOCIAL_MEDIA = 'Social Media (Top-down)',
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

export interface MenuParsedResponse {
  dishes: {
    name: string;
    description: string;
  }[];
}
