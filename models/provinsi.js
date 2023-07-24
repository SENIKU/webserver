const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const provinsiSchema = new Schema({
    _id : {
      type: String,
      default: function () {
          return new ObjectId().toString()
      }
    },
    nama : {
        type : String,
        required : [true, "please add provinsi"],
    },
    pertunjukans: { 
        type: Schema.Types.ObjectId, 
        ref: "pertunjukan" 
    },
})


const Provinsi = mongoose.model("provinsi", provinsiSchema);

module.exports = {
    Provinsi
}
