import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#15445e',
        },
        secondary: {
            main: '#d7d8db',
        },
        accent: red,
        type: 'light'
        ,
    }
});

export default theme;