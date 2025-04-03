import Image from "next/image"
import {ModeToggle} from "./(utils)/theme-button"
export default function Header() {
    return(
        <header className=" p-4 flex justify-between items-center px-24 ">
            <div className="flex items-center space-x-2 gap-3">
            <Image src="/MyLogo2.png" alt="Logo" width={36} height={36} className="hover:scale-110 transition-transform"/>
            <h1 className="text-[28px] leading-[42px] font-bold font-inter cursor-pointer hover:scale-110 transition-transform">Transcribelt</h1>
            </div>
            <nav className="flex space-x-4 gap-5">
                <a href="#" className="hover:underline underline-offset-6 decoration-[#EEB866FF] decoration-solid hover:text-[#EEB866FF] hover:scale-110 transition-transform">Home</a>
                <a href="#" className="hover:underline underline-offset-6 decoration-[#EEB866FF] decoration-solid hover:text-[#EEB866FF] hover:scale-110 transition-transform">About</a>
                <a href="#" className="hover:underline underline-offset-6 decoration-[#EEB866FF] decoration-solid hover:text-[#EEB866FF] hover:scale-110 transition-transform">Contact</a>
                <ModeToggle/>
            </nav>
        </header>
    )
}