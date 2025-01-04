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
  files_attached: boolean;
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
  files: IFile[] | IFileDto[] | null;
}

export interface IFile {
  id: number;
  sender_id: number;
  message_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_path: string;
  uploaded_at: string;
}

export interface SendMessageDto {
  created_at: string;
  message: string;
  sender_id: number;
  chat_id: number;
  seen?: boolean;
  id: number;
  files?: IFileDto[];
}

export interface UpdateInboxMessageDto {
  id: number;
  message: string;
  sender_id: number;
  receiver_id: number;
  files_attached: boolean;
  chat_id: number;
  seen: boolean;
}

export interface IFileDto extends IFile {
  buffer: ArrayBuffer;
}

export interface IURL {
  url: string;
  type: string;
  name: string;
  size: number;
  uploaded_at: string;
  retry_count: number;
}
