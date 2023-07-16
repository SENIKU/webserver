const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    _id : {
      type: String,
      default: function () {
          return new ObjectId().toString()
      }
    },
    fullname : {
        type : String,
        required : [true, "please add full name"],
    },
    username : {
        type : String,
        required : [true, "please add username"],
        unique : true,
    },
    email : {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password : {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
    },
    imgprofile: {
      type: String,
      
    },
    role : {
        type : String,
    }
},{
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
)


const User = mongoose.model("users", UserSchema);

module.exports = {
    User
}
