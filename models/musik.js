const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const musikSchema = new Schema({
    _id : {
      type: String,
      default: function () {
          return new ObjectId().toString()
      }
    },
    judul : {
        type: String,
        trim: true,
        required: [true, "Please add judul"],
    },
    content : {
        type: String,
        required: [true, "Please add content"],
    },
    provinsi : {
        type: String,
        trim: true,
        required: [true, "Please add provinsi"],
    },
    // provinsis: { 
    //     type: Schema.Types.ObjectId, 
    //     ref: "provinsi" 
    // },
    suka : {
        type : Boolean,
    },
    image: {
        type: String,
    },
    linkyt: {
        type: String,
    },
    referensi : {
        type : String
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
},{
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
)

const Musik = mongoose.model("musik", musikSchema);

module.exports = {
    Musik
}
