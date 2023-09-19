import * as express from "express";
import * as cors from "cors";
import mongoose from "mongoose";
import * as amqp from "amqplib/callback_api";
import * as morgan from "morgan";
import { Request, Response } from "express";
import { Product } from "./entity/Product.schema";
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

      const app = express();
      app.use(express.json());
      app.use(cors({ origin: ["http://localhost:3000"] }));
      app.use(morgan("dev"));

      const MONGODB_URI =
        "mongodb+srv://Hamannn:Hassan2019@cluster0.l2mxsax.mongodb.net/test?retryWrites=true&w=majority";
      mongoose
        .connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("Connected to MongoDB");
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error);
        });

      /////
      /////
      /////
      /////
      /////

      //CRUD FUNCTIONALITIES

      //CREATE
      app.post("/product/add", async (req: Request, res: Response) => {
        try {
          if (!req.body) {
            return res.status(400).json({
              status: "Failed",
              message: "add your body",
            });
          }
          console.log(req.body);
          const product = await Product.create(req.body);
          channel.sendToQueue(
            "create_product",
            Buffer.from(JSON.stringify(product))
          );
          return res.status(201).json({
            status: "Success",
            data: { product },
          });
        } catch (err) {
          res.status(400).json({
            status: "failedd",
            error: err,
          });
        }
      });

      //READ
      app.get("/product/get", async (req: Request, res: Response) => {
        const query = req.query;
        try {
          let products: any;

          if (!query) {
            products = await Product.find();
            return res.status(201).json({
              status: "Success",
              data: { products },
            });
          }
          let title: any, id: any, que: any;

          query.title || query.id
            ? (que = query.title || query.id)
            : (title = query.title),
            (id = query.id);
          products =
            (await Product.find({ que })) || Product.find({ title, id });
        } catch (err) {
          res.status(400).json({
            status: "failed",
            error: err,
          });
        }
      });

      //READ ONE
      app.get("/product/get/:getParam", async (req: Request, res: Response) => {
        const queryParam = req.params.getParam;
        try {
          const product = await Product.findOne({ title: queryParam });
          product
            ? res.status(200).json({ status: "Success", product: product })
            : res.status(404).json({
                status: "Failed",
                message: "Failed To Find These product",
                product: product,
              });
        } catch (err) {
          return res.status(400).json({
            status: "ERROR",
            Error: err,
          });
        }
      });

      //UPDATE

      app.patch("/product/update/:id", async (req: Request, res: Response) => {
        const param = req.params.id;
        const body = req.body;
        try {
          const product = await Product.findOneAndUpdate({ _id: param }, body);

          if (product) {
            channel.sendToQueue(
              "product_updated",
              Buffer.from(JSON.stringify(product))
            );
            return res.status(201).json({
              status: "Successful",
              product: product,
            });
          }
          return res.status(400).json({ status: "Failed", product: product });
        } catch (err) {
          return res.status(400).json({
            status: "Failed",
            ERROR: err,
          });
        }
      });

      //DELETE

      app.delete("/product/delete/:id", async (req: Request, res: Response) => {
        const param = req.params.id;
        try {
          const product = await Product.findByIdAndDelete({ _id: param });

          if (product) {
            channel.sendToQueue(
              "product_deleted",
              Buffer.from(JSON.stringify(product))
            );
            return res.status(201).json({
              status: "Successful",
              product: product,
            });
          }
          return res.status(400).json({ status: "Failed", product: product });
        } catch (err) {
          return res.status(400).json({
            status: "Failed",
            ERROR: err,
          });
        }
      });

      //LIKES

      app.post("/product/like/:id", async (req: Request, res: Response) => {
        const param = req.params.id;
        try {
          const product = await Product.findOne({ _id: param });

          if (product) {
            product.likes += 1;
            await product.save();
            return res.status(201).json({
              status: "Successful",
              product: product,
            });
          }
          return res.status(400).json({ status: "Failed", product: product });
        } catch (err) {
          return res.status(400).json({
            status: "Failed",
            ERROR: err,
          });
        }
      });
      //GET QUERY PARAMETERS

      /////
      /////
      /////
      /////
      /////
      app.listen(4080, (err: Error | null): any => {
        err
          ? console.log(err)
          : console.log(`ADMIN--SERVER RUNNING ON PORT 4080`);
      });

      process.on("beforeExit", () => {
        connection.close();
      });
    });
  }
);
