import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4 px-4">
        <p className="text-base">© {new Date().getFullYear()} Transcribelt. All rights reserved.</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-400">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </footer>
  );
}