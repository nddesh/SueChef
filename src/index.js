import React from 'react';
import ReactDOM from 'react-dom';
import {createMuiTheme} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './index.css';
import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#dfefc2',
      main: '#8cb050',
      dark: '#3c7429',
    },
    secondary: {
      main: '#fff38b'
    }
  },
  typography: {
    fontFamily: ['"Bodoni Moda"', '"Times New Roman"', 'Times', 'serif'].join(','),
  }
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);