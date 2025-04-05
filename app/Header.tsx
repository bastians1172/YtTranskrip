import Image from "next/image";
import { ModeToggle } from "../components/theme-button";

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex-grow flex justify-center">
        <div className="flex items-center gap-3">
          <Image
            src="/MyLogo2.png"
            alt="Transcribelt Logo"
            width={36}
            height={36}
            className="hover:scale-105 transition-transform"
          />
          <h1 className="text-[28px] leading-[42px] font-bold font-inter cursor-pointer hover:scale-105 transition-transform">
            Transcribelt
          </h1>
        </div>
      </div>
      <div className="flex items-center">
        <ModeToggle />
      </div>
    </header>
  );
}