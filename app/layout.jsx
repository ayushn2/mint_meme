import { Nabla } from "next/font/google";
import "./globals.css";
const nabla = Nabla({ subsets: ['latin'] })

export const metadata = {
  title: "mint meme",
  description: "meme coin launch pad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nabla.className} bg-black`}>
          {children}
      </body>
    </html>
  );
}