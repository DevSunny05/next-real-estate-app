import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);

    const SIGNING_SECRET = process.env.SIGNING_SECRETS;

    if (!SIGNING_SECRET) {
      throw new Error("Error!! Please add SIGNING_SECRET from clerk");
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;

    if (evt.type === "user.created") {
      console.log("New user created:", evt.data.id);
      // Handle user creation
    }

    if (evt.type === "user.updated") {
      console.log("New user Updated:", evt.data.id);
      // Handle user creation
    }

    if (evt.type === "user.deleted") {
      console.log("New user Deleted:", evt.data.id);
      // Handle user creation
    }
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
