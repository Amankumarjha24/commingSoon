export type CartoonCharacter = 'bear' | 'dino' | 'unicorn' | 'bunny';
export type BoxTheme = 'candy' | 'gold' | 'cosmic' | 'neon' | 'rainbow';
export type SurpriseType = 'cake' | 'voucher' | 'letter' | 'melody';
export type MusicTheme = 'cheerful' | 'musicbox' | 'party' | 'lofi';
export type Occasion = 'Birthday' | 'Diwali' | 'Eid' | 'Christmas' | 'Holi' | string;

export interface BirthdayWish {
  id: string;
  recipientName: string;
  senderName: string;
  age?: string;
  message: string;
  character: CartoonCharacter;
  theme: BoxTheme;
  surpriseType: SurpriseType;
  voucherText?: string;
  musicTheme: MusicTheme;
  occasion?: Occasion;
  photoUrl?: string;
  createdAt: number;
  expiresAt: number; // strictly 24 hours from creation
}

export type ViewState = 
  | 'create' 
  | 'share' 
  | 'recipient-intro' 
  | 'recipient-unboxing' 
  | 'recipient-revealed' 
  | 'expired';
