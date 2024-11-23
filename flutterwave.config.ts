import env from "@/env";
const Flutterwave = require("flutterwave-node-v3");

export const flw = new Flutterwave(env.payment.public, env.payment.secret);