export const hostname = '10.147.18.159';
export const port = '8010'

export type Message = {
  id?: number;
  username?: string;
  data?: string;
  send_time?: string;
  error?: string;
};

export type Receipt = {
  msg_id?: number;
  status?: boolean;
}