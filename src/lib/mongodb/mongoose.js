import mongoose from "mongoose";

// let initialized = false;
// export const connect = async () => {
//   mongoose.set("strictQuery", true);

//   if (initialized) {
//     console.log("Mongodb already connected");
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       dbname: "next-estate",
//       useNewUrlParser: true,
//       useUnifiedTopilogy: true,
//     });

//     initialized = trueconsole.log("Mongodb connected");
//   } catch (error) {
//     console.log(error);
//   }
// };

export async function connect() {
  try {
    // Avoid deprecation warnings for query filters in older codebases
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(
      `MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connect;
