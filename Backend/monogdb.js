import mongoose from "mongoose"
const url="mongodb+srv://mohit_cloud:Mohit13@cluster0.mgwm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/chatterUP"

const connectDB =async ()=>{
    try{
        await mongoose.connect(url,{
           
        })
        console.log("MongoDb is connected successfully");

    }
    catch(err){
        console.log("error connecting the mongodb",err.message);
    }
}
export default connectDB;
