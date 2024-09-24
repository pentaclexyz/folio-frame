import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

const factorARegular = localFont({
    src: "./fonts/FactorAMono-Regular.otf",
    variable: "--font-factor-a-regular",
});
const factorABold = localFont({
    src: "./fonts/FactorAMono-Bold.otf",
    variable: "--font-factor-a-bold",
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
        <body
            className={`${factorARegular.variable} ${factorABold.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
