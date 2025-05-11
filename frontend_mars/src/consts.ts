export const hostname = '192.168.56.1';
export const port = '8020'

export type Message = {
  id?: number;
  username?: string;
  data?: string;
  send_time?: string;
  error?: string;
};