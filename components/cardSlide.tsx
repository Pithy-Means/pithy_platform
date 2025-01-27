"use client";
import dynamic from "next/dynamic";
import React from "react";
import Image from "next/legacy/image";
import "../app/globals.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoMdArrowForward, IoMdArrowBack } from "react-icons/io";
import { CustomArrowProps as ReactSlickArrowProps } from "react-slick";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  name: string;
  role: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageSrc,
  name,
  role,
}) => {
  const imagePath = imageSrc ? `${imageSrc}` : null;

  return (
    <div className=" w-full h-[15rem] sm:h-[20rem] shadow-lg rounded-lg p-6 bg-slate-100">
      <h2 className="text-xl font-bold ">{title}</h2>
      <p className="text-lg mt-2 ">{description}</p>
      <div className="mt-2 flex flex-row items-center">
        {imagePath ? (
          <Image
            src={imagePath}
            height={50}
            width={50}
            alt={`${name}'s image`}
            className=""
          />
        ) : (
          <IoPersonCircleOutline size={50} className="text-gray-400" />
        )}
        <div className="ml-4">
          <h3 className="text-lg mt-2">{name}</h3>
          <p className="text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

interface CardCarouselProps {
  cards?: CardProps[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ cards = [] }) => {
  // const [currentSlide, setCurrentSlide] = useState(0);
  // const totalSlides = cards.length;

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      {cards.length > 0 ? (
        <>
          <Slider {...settings}>
            {cards.map((card, index) => (
              <div key={index} className="px-2">
                <Card
                  key={index}
                  title={card.title}
                  description={card.description}
                  imageSrc={card.imageSrc}
                  name={card.name}
                  role={card.role}
                />
              </div>
            ))}
          </Slider>

          <div className="flex items-center">
            <div className=" left-0 w-full flex space-x-4 p-4">
              <PrevArrow
                slickPrev={() =>
                  (document.querySelector(".slick-prev") as HTMLElement).click()
                }
              />
              <NextArrow
                slickNext={() =>
                  (document.querySelector(".slick-next") as HTMLElement).click()
                }
              />
            </div>
          </div>
        </>
      ) : (
        <p>No cards to show</p>
      )}
    </div>
  );
};

export default CardCarousel;

interface CustomArrowProps extends ReactSlickArrowProps {
  slickPrev?: () => void;
  slickNext?: () => void;
}

const NextArrow: React.FC<CustomArrowProps> = ({ className, slickNext }) => {
  // const { className, onClick } = props;
  return (
    <div
      className={`${className} bg-transparent border border-green-400 rounded cursor-pointer`}
      onClick={slickNext}
    >
      <IoMdArrowForward size={40} className="text-green-500 px-2 " />
    </div>
  );
};

const PrevArrow: React.FC<CustomArrowProps> = ({ className, slickPrev }) => {
  // const { className, onClick } = props;
  return (
    <div
      className={`${className} bg-transparent border border-green-400 rounded cursor-pointer`}
      onClick={slickPrev}
    >
      <IoMdArrowBack size={40} className="text-green-500 px-2" />
    </div>
  );
};
