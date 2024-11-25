import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from "next";
import "./globals.css";
import { Lato } from 'next/font/google';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { ReactQueryClientProvider } from './react-query-provider';

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
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}