import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Pentafolio",
    description: "Made by pentacle",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        {/*<head>*/}
        {/*    <meta property="og:title" content="Pentafolio"/>*/}
        {/*    <meta property="fc:frame:post_url" content="https://folio-frame.vercel.app/"/>*/}
        {/*    <meta property="fc:frame" content="" />*/}
        {/*    <meta property="fc:frame:image" content="https://folio-frame.vercel.app/home-frame.png"/>*/}
        {/*    <meta property="og:image" content="https://folio-frame.vercel.app/home-frame.png"/>*/}
        {/*</head>*/}
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
