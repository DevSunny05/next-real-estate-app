import mongoose from "moongoose";

let initialized = false;
export const connect = async () => {
  mongoose.set("strictQuery", true);

  if (initialized) {
    console.log("Mongodb already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbname: "next-estate",
      useNewUrlParser: true,
      useUnifiedTopilogy: true,
    });

    initialized = trueconsole.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
};
