import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import englishTranslations from './translations/translations.en.json';
import bulgarianTranslations from './translations/translations.bg.json';
import { supportedLanguages } from './common.config';
import ReactTooltip from 'react-tooltip';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

// add browser language detection ( if it is among the supported languages ) 
const defaultLanguage = supportedLanguages.find(l => l.default);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: englishTranslations },
      bg: { translation: bulgarianTranslations }
    },
    lng: defaultLanguage.identifier,
    fallbackLng: defaultLanguage.identifier,
    interpolation: {
      escapeValue: false
    }
  });

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <App />
    <ReactTooltip />
  </BrowserRouter>,
  rootElement);
