export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  imageUrl?: string;
  base64Image?: string;
  mimeType?: string;
}

export interface UserData {
  userName: string;
  aiName: string;
  userAvatar: string;
  aiAvatar: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  userData: UserData;
  lastUpdated: number;
}
