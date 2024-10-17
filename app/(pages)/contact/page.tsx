"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import TitleDot from "@/components/TitleDot";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ContactInfo from "@/components/ContactInfo";
import { Card } from "@/components/ui/card";
import InputContact from "@/components/InputContact";
import FreqAskeQuestion from "@/components/FreqAskeQuestion";
import SpecialOffer from "@/components/SpecialOffer";
import Footer from "@/components/Footer";
import SpecialMobile from "@/components/SpecialMobile";
// import GoogleMaps from "@/components/GoogleMaps";

const DynamicMap = dynamic(() => import("../../../components/Map"), {
  ssr: false,
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = { name, email, phone, message };

    try {
      const res = await fetch("/api/emails/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setResponseMessage("Email sent successfully!");
      } else {
        setResponseMessage("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending form:", error);
      setResponseMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <div>
      <div className="">
        <div className="flex justify-center bg-black items-center h-96">
          <h3 className="text-lg lg:text-4xl md:text-2xl text-[#5AC35A]">
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
                title={"office usa"}
                location={
                  "1309 Coffeen Avenue STE 10269, Sheridan, WY 82801, USA"
                }
                email={"contact@pithymeans.com"}
                phone={["+1 (307) 374-0993", " +1 (307) 205-5983"]}
                className="text-black break-normal"
              />
              <ContactInfo
                title={"office uganda"}
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
              <Card className="bg-white py-20 px-6 h-fit w-full">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4"
                >
                  <InputContact
                    label="Name"
                    type="text"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <InputContact
                    label="Email"
                    type="email"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputContact
                    label="Phone Number"
                    type="tel"
                    className="w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <InputContact
                    label="Message"
                    isTextarea={true}
                    className="w-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-[#5AC35A] text-white p-2 rounded-lg w-fit mx-auto md:w-52 md:text-lg lg:w-72 lg:text-2xl flex justify-center text-center"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </form>
              </Card>
            ) : (
              <Card className="bg-[#5AC35A] py-10 px-6 w-full flex justify-center items-center">
                <div className="flex flex-col space-y-8">
                  <h3 className="text-black text-5xl font-extrabold capitalize">
                    Thank you
                  </h3>
                  <div className="flex flex-col space-y-2 items-center">
                    <div className="bg-[#1111116c] h-1 w-full rounded" />
                    <p className="text-black capitalize">
                      We’ll be in touch soon
                    </p>
                  </div>
                </div>
              </Card>
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
          <div className="lg:block hidden">
            <SpecialOffer />
          </div>
          <div className="lg:hidden block">
            <SpecialMobile />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Contact;
