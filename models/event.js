const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const EventSchema = new Schema({
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
    deskripsi : {
        type: String,
        trim: true,
        required: [true, "Please add jenis"],
    },
    image : {
        type: String,
    },
    jadwal : {
        type : Date,
        trim: true,
        required: [true, "Please add jenis"],
    },
    lokasi : {
        type: String,
        trim: true,
        required: [true, "Please add provinsi"],
    },
    orang : {
        type : String,
    },
    tiket: {
        type: String,
    },
    comments : [{
        users : {
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
    },
],
},{
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
)

const Event = mongoose.model("event", EventSchema);

module.exports = {
    Event
}
