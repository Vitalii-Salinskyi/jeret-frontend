export interface UserChat {
  chat_id: number;
  user_id: number;
  name: string;
  job_role: string;
  profile_picture: string;
  last_message: LastMessage;
}

export interface LastMessage {
  seen: boolean;
  message: string;
  sender_id: number;
  created_at: Date;
}
