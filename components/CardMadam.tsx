import Image from "next/image";

const CardMadam = () => {
  return (
    <div className="bg-white">
      <div className="bg-[#5AC35A] shadow-inner flex items-center justify-center h-[300px] w-[300px] relative">
        <Image
          src="/assets/whoweare.png"
          height={320}
          width={220}
          alt="Header"
          priority
          className="object-contain absolute top-[-70px] drop-shadow-2xl"
          style={{ height: "370px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default CardMadam;
