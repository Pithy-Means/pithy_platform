/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import TitleDot from "@/components/TitleDot";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ContactInfo from "@/components/ContactInfo";
import { Card } from "@/components/ui/card";
import FreqAskeQuestion from "@/components/FreqAskeQuestion";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ThankYouMessage from "@/components/ThankYouMessage";
import { Metadata } from "next";

const DynamicMap = dynamic(() => import("../../../components/Map"), {
  ssr: false,
});

const metadata: Metadata = {
  title: "Contact",
  description: "Contact Pithy Means for questions, feedback or support.",
  keywords: ["Pithy Means", "contact", "questions", "feedback", "support"],
  openGraph: {
    title: "Contact",
    description: "Contact Pithy Means for questions, feedback or support.",
    url: "https://www.pithymeans.com/contact",
    siteName: "Pithy Means",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Pithy Means - Empowering Individuals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description: "Contact Pithy Means for questions, feedback or support.",
    images: ["/opengraph-image.png"],
  },
}

const Contact = () => {
  const [responseMessage, setResponseMessage] = useState("");

  return (
    <>
        <div className="flex justify-center bg-black items-center h-96">
          <h3 className="text-lg md:text-2xl lg:text-3xl xl:text-5xl 4k:text-6xl text-[#5AC35A]">
            Contact
          </h3>
        </div>
        <div className="bg-white">
          <div className="flex lg:flex-row flex-col-reverse justify-between p-10">
            <div className="flex flex-col lg:items-start items-center space-y-8 w-full">
              <div className="text-center mt-4 -mb-4">
                <TitleDot title="get in touch" />
                <p className="text-base text-black capitalize">
                  contact us for questions, feedback or support
                </p>
              </div>
              <ContactInfo
                title={"Contact In USA"}
                location={
                  "1309 Coffeen Avenue STE 10269, Sheridan, WY 82801, USA"
                }
                email={"contact@pithymeans.com"}
                phone={["+1 (307) 374-0993", " +1 (307) 205-5983"]}
                className="text-black break-normal"
              />
              <ContactInfo
                title={"Contact In Africa"}
                location={
                  "Plot No 546, ROFRA house, 4th Floor, Room No 2, Ggaba Road, Kansanga, Kampala."
                }
                email={"pithymeansafrica@gmail.com"}
                phone={[
                  "+256 750 175 892",
                  "+256 760 389 466",
                  "+256 783 184 543",
                ]}
                className="text-black"
              />
              <SocialMediaLinks className="text-black" />
            </div>
            {!responseMessage ? (
              <ContactForm setResponseMessage={setResponseMessage} />
            ) : (
              <ThankYouMessage />
            )}
          </div>
          <div className="h-24">
            <div
              className="bg-contain bg-no-repeat bg-left-bottom"
              style={{
                backgroundImage: "url('/assets/leftfooter.png')",
                height: "300px",
                width: "300px",
              }}
            />
          </div>
          <div className="bg-gradient-to-b from-[#61BC5B] to-white z-10 py-10">
            <div className="flex justify-center items-center flex-col space-y-4 py-10">
              <h3 className="text-black text-xl font-bold">Find Us Here</h3>
              <p className="text-black capitalize">
                our uganda office location
              </p>
              <Card className="bg-white w-5/6 flex items-center justify-center">
                <div className="">
                  <DynamicMap />
                </div>
              </Card>
            </div>
          </div>
          <FreqAskeQuestion />
          <Footer />
        </div>
    </>
  );
};

export default Contact;
