export interface Moments {
  id?: number;
  title: string;
  description: string;
  image: string; // Tipicamente, este seria um URL da imagem após o upload
  created_at?: string;
  updated_at?: string;
  comments?: { text: string; username: string }[];
}
