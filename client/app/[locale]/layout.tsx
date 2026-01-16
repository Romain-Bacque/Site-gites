import "../reset.css";
import "../globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import LoaderAndAlert from "../components/UI/LoaderAndAlert";
import EmotionCacheProvider from "../emotion-cache";
import { NextIntlClientProvider } from "next-intl";
import ClientProviders from "../providers";
import AuthWatcher from "../AuthWatcher";
import ScrollToTop from "../components/UI/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../public/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="backdrop-root" />
        <div id="overlay-root" />

        <EmotionCacheProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientProviders>
              <LoaderAndAlert />
              <AuthWatcher />
              <Header />
              <main>{children}</main>
              <Footer />
              <ScrollToTop />
            </ClientProviders>
          </NextIntlClientProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}
