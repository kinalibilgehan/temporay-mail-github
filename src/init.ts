import * as dotenv from "dotenv";

dotenv.config();

export const SENDGRID_API_KEY: string = (process.env.SENDGRID_API_KEY as string);
export const THE_GRAPH_URL: string = (process.env.THE_GRAPH_URL as string);
export const SEND_EMAIL_FROM: string = (process.env.SEND_EMAIL_FROM as string);