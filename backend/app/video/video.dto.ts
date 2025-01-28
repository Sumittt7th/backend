import { type BaseSchema } from "../common/dto/base.dto";
export interface IVideo extends BaseSchema {
    title: string;
    description?: string;
    url: string;
    hlsUrl:string;
    duration?: number;
    access: "free" | "paid";
    viewCount: number;
    public_id:string;
}
