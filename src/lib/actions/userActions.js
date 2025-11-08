import userModel from "../models/userModel";
import { connect } from "../mongodb/mongoose";

export const createorUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_address
) => {
  try {
    await connect();

    const user = await userModel.findOneAndUpdate(
      {
        clerkId: id,
      },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_address[0].email_address,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    return user;
  } catch (error) {
    console.log("Error:could not create or update user", error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    await userModel.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log(error);
  }
};
