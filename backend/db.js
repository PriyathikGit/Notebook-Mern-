const mongoose =require('mongoose');
const mongoURI = 'mongodb://0.0.0.0:27017/inotebook'

const connectToMongo = async()=>{
      let data =  await mongoose.connect(mongoURI)
    //   console.log(data)
}
console.log("connect to mongoose")
module.exports=connectToMongo