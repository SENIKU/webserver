const {mongoose} = require("mongoose");

const PertunjukanSchema = new mongoose.Schema({
    judul : {
        type: String,
        trim: true,
        required: [true, "Please add judul"],
    },
    content : {
        type: String,
        trim: true,
        required: [true, "please add content"],
    },
    image: {
        type: String,
        default: "https://aseanyouthforum.org/wp-content/uploads/2019/03/cropped-Logo-Asean-Youth-Forum-HR-01.png"
    },
    comments : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        comment : {
            type : String
        },
        createdAt : {
            type : Date,
            default : Date.now
        }
    }],
})

const pertunjukan = mongoose.model("pertunjukan", PertunjukanSchema);
module.exports = {
    pertunjukan
}
