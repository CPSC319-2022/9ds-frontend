import grey from '@mui/material/colors/grey'
import createTheme from '@mui/material/styles/createTheme'
import { alpha } from '@mui/material/styles'
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    black: Palette['primary']
    white: Palette['primary']
  }

  interface PaletteOptions {
    black: PaletteOptions['primary']
    white: PaletteOptions['primary']
  }

  interface PaletteColor {
    main: string
    '50%': string
    '30%': string
    '25%': string
    light: string
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'body1.medium': React.CSSProperties
    'body1.bold': React.CSSProperties
    'body2.medium': React.CSSProperties
    'body2.bold': React.CSSProperties
    body3: React.CSSProperties
    'body3.medium': React.CSSProperties
    'body3.bold': React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    'body1.medium': React.CSSProperties
    'body1.bold': React.CSSProperties
    title: React.CSSProperties
    subheading: React.CSSProperties
    caption: React.CSSProperties
    small: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'body1.medium': true
    'body1.bold': true
    title: true
    subheading: true
    caption: true
    small: true
  }
}

//Colors defaults to main if not applicable/present/used
const paletteObject = {
  primary: {
    main: '#6E46C3',
    '50%': '#6E46C3',
    '30%': '#6E46C3',
    '25%': '#6E46C3',
    light: '#6E46C3',
  },
  black: {
    main: '#000000',
    '50%': alpha('#373737', 0.5),
    '30%': alpha('#3E3636', 0.3),
    '25%': alpha('#B2B2B2', 0.25),
    light: alpha('#646464', 0.3),
  },
  white: {
    main: '#FFFFFF',
    '50%': '#FFFFFF',
    '30%': '#FFFFFF',
    '25%': '#FFFFFF',
    light: '#F8F8FA',
  },
}

export const theme = createTheme({
  palette: paletteObject,
  typography: {
    h1: {
      fontFamily: 'Roboto',
      fontSize: '112px',
      fontWeight: 300,
      lineHeight: '120%',
      letterSpacing: 0,
    },
    h2: {
      fontFamily: 'Roboto',
      fontSize: '56px',
      fontWeight: 300,
      lineHeight: '120%',
      letterSpacing: 0,
    },
    h3: {
      fontFamily: 'Roboto',
      fontSize: '45px',
      fontWeight: 400,
      lineHeight: '120%',
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Roboto',
      fontSize: '34px',
      fontWeight: 400,
      lineHeight: '120%',
      letterSpacing: 0,
    },
    h5: {
      fontFamily: 'Roboto',
      fontSize: '24px',
      fontWeight: 400,
      lineHeight: '120%',
      letterSpacing: 0,
    },
    body1: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '150%',
      letterSpacing: 0,
    },
    'body1.medium': {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
    'body1.bold': {
      fontFamily: 'Roboto',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '150%',
      letterSpacing: 0,
    },
    title: {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
    subheading: {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
    caption: {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
    button: {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
    small: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '120%',
      letterSpacing: 0,
    },
  },
  spacing: 1, // overriding the default mui spacing of 8px -> 1px
  //all component generized styles should go here
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
        sizeLarge: {
          padding: '6px 22px 6px 22px',
        },
        sizeMedium: {
          padding: '6px 16px 6px 16px',
        },
        sizeSmall: {
          padding: '6px 10px 6px 10px',
        },
      },
    },
  },
})
