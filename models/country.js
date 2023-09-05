import mongoose from "mongoose";

const schema = new mongoose.Schema({
    nameCommon: {
        type: String,
    },
    nameOfficial:{
        type: String,
    },
    independent:{
        type: Boolean,
    },
    capital:{
        type: String,
    },
    region:{
        type: String,
    },
    coatOfArms:{
        type: String,
    },
    flags:{
        type: String
    },
    alt:{
        type: String
    }

})

export default mongoose.model("mCountry", schema);