"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import TitleDot from "./TitleDot";

const categories = [
  { name: "general" },
  { name: "guidance & results" },
  { name: "pricing & payment" },
  { name: "partnership & affiliates" },
  { name: "technical issues" },
];

const faqs = [
  {
    category: "general",
    question: "What is Pithy Means?",
    answer:
      "PITHY MEANS (CONSISE WAYS) is a name of a company, registered in the USas PITHY MENS LLC, and then in Africa in Uganda as PITHY MEANS AFRICA LTD. The aim is to assist students and opportunity seekers in how to choose their most suitable career and business activity areas aligned with their natural/inner talents, behavior tendency and vocation.",
  },
  {
    category: "general",
    question: "Why is this assistance needed?",
    answer:
      "Global research shows that around 80% of people are doing their studies or activities in the wrong areas which don’t match their behavior tendencies, which leads to unhappiness and unsatisfaction, stress, low performance, with negative impact of the results and health.",
  },
  {
    category: "general",
    question: "How do I sign up?",
    answer:
      "Click 'Sign Up' on the landing page and fill out the form. Accept the Terms and Conditions, then click 'Submit'. You'll receive a confirmation notification and a verification link via email or SMS. Verify your account, then log in with your email and password.",
  },
  {
    category: "guidance & results",
    question: "Is there any assessment?",
    answer:
      "Yes, an assessment checks your understanding and helps you choose the right activity area.",
  },
  {
    category: "guidance & results",
    question: "How long does it take to get results?",
    answer: "It usually takes a few minutes after completing the assessment.",
  },
  {
    category: "pricing & payment",
    question: "Is Pithy Means Courses Free?",
    answer:
      "No, the Pithy Mean course requires a one-time payment of $6 (or equivalent) for 90 days of access. Payment is made online via FLUTTERWAVE, with options like bank card, mobile money, MPESA, or Google Pay, depending on your country.",
  },
  {
    category: "pricing & payment",
    question: "Do you offer refunds?",
    answer: "Yes, we have a refund policy for unsatisfied users.",
  },
  {
    category: "pricing & payment",
    question: "What payment methods are accepted?",
    answer:
      "Log in, click 'Pay' and use Flutterwave for payment. Verify your number, enter the OTP, and authorize with your PIN. Access services for 90 days after payment.",
  },
  {
    category: "partnership & affiliates",
    question: "How to become a Pithy Means partner?",
    answer:
      "Individuals or institutions can partner with us to advertise our services under agreed terms. Those who mobilize people to join will receive a 10% referral fee based on the amount paid by those they refer. Pithy Means may also partner with other companies when it aligns with our interests.",
  },
  {
    category: "technical support",
    question: "How to get technical support in case of any problem?",
    answer:
      "For support, use the inquiry space on the landing page, call +1 307 374-0993 / +256 772 289 692, or email pithymeans@gmail.com / management@pithymeansplus.com.",
  },
];

const FreqAskeQuestion = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");

  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const filteredFAQs = faqs
    .filter((faq) => faq.category === selectedCategory)
    .slice(0, 4);

  return (
    <div className="px-10 py-4 bg-white">
      <div className="flex flex-col space-y-4 lg:items-start items-center">
        <TitleDot title="Frequently asked questions" className="md:text-3xl" />
        <p className="capitalize text-black lg:text-start text-center md:text-xl">
          Get answers to your questions about Pithy Means
        </p>

        <div className="w-full max-w-full overflow-x-auto">
          <div className="flex space-x-4 items-center scroll-scroll-smooth snap-mandatory snap-x md:text-lg">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 border border-black rounded capitalize snap-center whitespace-nowrap ${selectedCategory === category.name ? "bg-black text-white" : "text-black"}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {filteredFAQs.map((faq) => {
            const globalIndex = faqs.findIndex((f) => f === faq);
            const isOpen = openFAQs.includes(globalIndex);

            return (
              <Card
                key={globalIndex}
                className="bg-white border rounded-lg shadow-sm p-5"
              >
                <div
                  className="flex justify-between py-2 items-center cursor-pointer"
                  onClick={() => toggleFAQ(globalIndex)}
                >
                  <h3 className="lg:text-lg text-black capitalize font-extrabold">
                    {faq.question}
                  </h3>
                  <div className="border p-1 rounded-full">
                    {isOpen ? (
                      <ArrowUpRight className="text-[#5AC35A]" />
                    ) : (
                      <ArrowDownLeft className="text-[#5AC35A]" />
                    )}
                  </div>
                </div>
                {isOpen && (
                  <p className="text-black capitalize mt-2">{faq.answer}</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FreqAskeQuestion;
