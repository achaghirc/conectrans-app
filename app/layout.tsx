import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import "./globals.css";
import { Lato } from 'next/font/google';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import theme from './theme';
import { ReactQueryClientProvider } from './react-query-provider';
import NetworkConnectionCheck from './network-connection-check';
import CoockieBanner from './ui/cookies/CoockieBanner';

const latoFont = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato'
});


export const metadata: Metadata = {
  title: "Conectrans App",
  description: "Conectrans is an application made for the transport industry, to connect drivers with companies by offering a platform to post offers and request them by the candidates.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={`${latoFont.variable} antialiased`}>
          <AppRouterCacheProvider 
            options={{ key: 'css' }}
            >
            <ThemeProvider theme={theme} defaultMode='system'>
            <GlobalStyles styles={{ "*": { scrollbarWidth: "none", msOverflowStyle: "none" }, "*::-webkit-scrollbar": { display: "none" } }} />
              <CoockieBanner />
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
          <NetworkConnectionCheck />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}