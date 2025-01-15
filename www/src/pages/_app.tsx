import Head from "next/head";
import React, { FC } from "react";

// project imports
import type { AppProps } from "next/app";
import Theme from "../themes";
import { wrapper } from "../store";
import CustomAlert from "@/components/CustomAlert";
import { loadUser } from "@/store/auth/auth.actions";

// styles + assets
import "@/styles/globals.css";

// third-party libraries
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider, useDispatch } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "moment/locale/de";
import "moment/locale/en-gb";
import "moment/locale/zh-cn";

const locales = ["en-us", "en-gb", "zh-cn", "de"];

type LocaleKey = (typeof locales)[number];

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const [locale, setLocale] = React.useState<LocaleKey>("en-us");

  if (moment.locale() !== locale) {
    moment.locale(locale);
  }
  // store.dispatch(loadUser());
  // const dispatch = useDispatch<any>();
  React.useEffect(() => {
    store.dispatch(loadUser());
    localStorage.setItem("sidebar", "close");
  }, [store]);

  return (
    <Provider store={store}>
      <AppCacheProvider {...props}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <title>SFDS - Safety First Driving School</title>
        </Head>
        <ThemeProvider theme={Theme}>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale={locale}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <CustomAlert />
            <Component {...pageProps} />
          </LocalizationProvider>
        </ThemeProvider>
      </AppCacheProvider>
    </Provider>
  );
};

export default MyApp;
