import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

function createTheme(prefersDarkMode) {
  return createMuiTheme({
    palette: {
      primary: {
        main: '#15445e',
      },
      secondary: {
        main: '#d7d8db',
      },
      accent: red,
      type: prefersDarkMode ? 'dark' : 'light',
    }
  });
}

export default createTheme;