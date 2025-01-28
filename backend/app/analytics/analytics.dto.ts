// analytics.dto.ts
import { BaseSchema } from "../common/dto/base.dto";
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';

export interface IAnalytics extends BaseSchema {
    videoId: Video;       
    userId: User;         
    views: number;          
}
