const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const jenisSchema = new Schema({
    _id : {
      type: String,
      default: function () {
          return new ObjectId().toString()
      }
    },
    jenis : {
        type : String,
        required : [true, "please add jenis pertunjukan"],
    },
})


const Jenis = mongoose.model("jenis", jenisSchema);

module.exports = {
    Jenis
}
