import * as express from "express";
import * as cors from "cors";
import mongoose from "mongoose";
import * as amqp from "amqplib/callback_api";
import { Product } from "./entities/product";
amqp.connect(
  "amqps://sndgkkfu:ZbwVSLDLxDPv0YzW54fOKxtRATmmDd58@rattlesnake.rmq.cloudamqp.com/sndgkkfu",
  (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue("create_product", { durable: false });
      channel.assertQueue("product_updated", { durable: false });
      channel.assertQueue("product_deleted", { durable: false });

      const app = express();
      app.use(express.json());
      app.use(cors({ origin: ["http://localhost:3000"] }));

      const mongoDb_uri =
        "mongodb+srv://hassan:Hassan2019@hassancluster.4qgat.mongodb.net/test?retryWrites=true&w=majority";

      mongoose.connect(mongoDb_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = mongoose.connection;

      db.on("error", (error) => {
        console.error("MongoDB connection error:", error);
      });

      db.once("open", () => {
        console.log("MONGODB CONNECTED SUCCESSFULLY.....");
      });

      db.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });
      /////
      /////
      /////
      /////
      /////
      channel.consume(
        "create_product",
        async (msg) => {
          const eventProduct = JSON.parse(msg.content.toString());
          const product = await Product.create({
            admin_id: eventProduct._id,
            ...eventProduct,
          });
          product
            ? console.log("product created")
            : console.log("product did not create");
        },
        { noAck: true }
      );

      channel.consume(
        "product_updated",
        async (msg) => {
          const eventProduct = JSON.parse(msg.content.toString());
          try {
            const product = await Product.findOneAndUpdate(
              { admin_id: eventProduct._id },
              { admin_id: eventProduct._id, ...eventProduct }
            );

            product
              ? console.log("product updated successfullyy")
              : console.log("product did not updatee");
          } catch (err) {
            throw err;
          }
        },
        { noAck: true }
      );

      channel.consume("product_deleted", async (msg) => {
        const eventProduct = JSON.parse(msg.content.toString());
        try {
          const product = await Product.findOneAndDelete({
            admin_id: eventProduct._id,
          });
          product
            ? console.log("product deleted successfullyy")
            : console.log("product did not delete");
        } catch (err) {
          throw err;
        }
      });

      app.listen(5000, (err: Error | null): any => {
        err
          ? console.log(err)
          : console.log(`MAIN-SERVER RUNNING ON PORT 5000`);
      });

      process.on("beforeExit", () => {
        connection.close();
      });
    });
  }
);
