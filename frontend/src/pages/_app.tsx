import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/context/ThemeContext";
import MobileOnlyGate from "@/components/mobileOnlyGate";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <MobileOnlyGate>
        <Component {...pageProps} />
      </MobileOnlyGate>
    </ThemeProvider>
  );
}
