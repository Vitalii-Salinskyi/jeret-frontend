export interface UserChat {
  chat_id: number;
  user_id: number;
  name: string;
  job_role: string;
  profile_picture: string;
  last_message: LastMessage;
}

export interface LastMessage {
  id: number;
  seen: boolean;
  message: string;
  sender_id: number;
  created_at: string;
}

export interface IMessage {
  id: number;
  sender_id: number;
  chat_id: number;
  message: string;
  seen: boolean;
  files_attached: boolean;
  created_at: string;
  edited_at: string;
}

export interface SendMessageDto {
  created_at: string;
  message: string;
  sender_id: number;
  chat_id: number;
  seen?: boolean;
  id: number;
}

export interface UpdateInboxMessageDto {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  chat_id: number;
  seen: boolean;
}
