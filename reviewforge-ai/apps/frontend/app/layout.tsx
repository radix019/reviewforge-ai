import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import './globals.css';
import { Providers } from './providers';
import ThemeRegistry from './theme/ThemeRegistry';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Providers>{children}</Providers>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
