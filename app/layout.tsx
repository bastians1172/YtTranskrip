import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "./footer";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'YouTube Transcript Tool',
    template: '%s | YouTube Transcript Tool'
  },
  description: 'YouTube Transcript Tool ,Generate and download transcripts from YouTube videos easily. Support for multiple languages and formats.',
  keywords: ['YouTube transcript', 'video transcription', 'subtitle generator', 'YouTube captions', 'transcript downloader', 'video subtitles', 'YouTube video tool','youtube to text','youtube subtitle','youtube transcript generator'],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    languages: {
      'en-US': '/en',
      'id-ID': '/id',
    },
  },
  openGraph: {
    title: 'YouTube Transcript Tool',
    description: 'Generate and download transcripts from YouTube videos easily',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['id_ID'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ` }
      >
                  <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
         <Header />
            {children}
            <Footer/>
          </ThemeProvider>
      </body>
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-ZYVBYHBKR2" />
  <Script id="google-analytics">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZYVBYHBKR2');
    `}
  </Script>
</html>
  );
}
