import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/logo.png"
        alt="Logo"
        width={32}
        height={32}
        className="w-8 h-8"
      />
      <span className="text-xl font-bold ml-2">Pithy Means</span>
    </Link>
  );
};

export default Logo;
