import "./globals.css";

export const metadata = {
  title: "Aashish Dhyani — MCA Student & Aspiring Full-Stack Developer",
  description:
    "Portfolio of Aashish Dhyani, an MCA student and aspiring full-stack developer building with React, Next.js, Node.js and MongoDB, and beginning DSA in Java.",
  openGraph: {
    title: "Aashish Dhyani — Aspiring Full-Stack Developer",
    description:
      "MCA student building practical web applications and learning Data Structures & Algorithms in Java.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
