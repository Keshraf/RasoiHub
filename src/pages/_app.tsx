import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const theme = createTheme({
  /** Put your mantine theme override here */
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <MantineProvider theme={theme}>
        <ClerkProvider {...pageProps}>
          <main
            className={cn(
              "bg-background min-h-screen font-sans antialiased",
              inter.variable,
            )}
          >
            <Component {...pageProps} />
          </main>
        </ClerkProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
