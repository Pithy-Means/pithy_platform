import Image from "next/image";

const CardImage = () => {
  return (
    <div className="bg-gradient-to-b from-[#5AC35A] via-[#00AE76] to-[#000] rounded-r-3xl flex items-center justify-center h-[380px] w-[350px] lg:p-0 px-10 lg:h-[480px] lg:w-[400px] xl:h-[500px] xl:w-[500px] 4k:h-[800px] 4k:w-[700px]">
      <Image
        src="/assets/Standing_ladies.png"
        height={450}
        width={250}
        priority
        alt="Header"
        className="object-contain drop-shadow-2xl"
        style={{ height: "550px", width: "100%" }}
      />
    </div>
  );
};

export default CardImage;
