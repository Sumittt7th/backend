import mongoose from "mongoose";
import { type IVideo } from "./video.dto";

const Schema = mongoose.Schema;

const VideoSchema = new Schema<IVideo>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    url: { type: String, required: true },
    public_id: {type:String,required:true},
    hlsUrl: { type: String },
    duration: { type: Number, required: false }, 
    access: { type: String, required: true, enum: ["free", "paid"], default: "free" }, 
    viewCount: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.model<IVideo>("video", VideoSchema);
