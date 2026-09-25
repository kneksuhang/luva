export interface ProductLink {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category_id?: string | null;
  category_name?: string;
  tags: string[];
  links: ProductLink[];
  is_archived: boolean;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string; // Iconify icon identifier, e.g. "lucide:sparkles", "ph:flower-tulip-thin"
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
}

export type DentoIroPaletteId = 
  | 'sakura' 
  | 'nadeshiko' 
  | 'toki' 
  | 'wakatake' 
  | 'fuji' 
  | 'rikyucha' 
  | 'kohaku'
  | 'shinbashi'
  | 'yamabuki'
  | 'akane';

export interface DentoIroPalette {
  id: DentoIroPaletteId;
  name: string;
  japaneseName: string;
  kanji: string;
  primaryColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  philosophy: string;
  meaning: string;
  character: string;
}
