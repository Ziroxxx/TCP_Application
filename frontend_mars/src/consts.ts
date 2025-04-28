export const hostname = '192.168.1.10';
export const port = '8020'

export type Message = {
  id?: number;
  username?: string;
  data?: string;
  send_time?: string;
  error?: string;
};