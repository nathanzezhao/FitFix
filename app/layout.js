import "./globals.css";
import { ProfileProvider } from "@/lib/store";

export const metadata = {
  title: "FitFix — find your vibe",
  description: "Personalized outfits built from a quiz, a photo, and your closet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </ProfileProvider>
      </body>
    </html>
  );
}
