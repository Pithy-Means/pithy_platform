"use server"

import env from "@/env";
import { Resend } from "resend";
import { CreateEmailOptions, CreateEmailRequestOptions } from "resend";

const resend = new Resend(env.emails.apikey);

export const sendEmail = async (
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions | undefined
) => {
  try {
    const response = await resend.emails.send(payload, options);
    console.log("Email sent", response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
