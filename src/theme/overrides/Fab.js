export default function Fab(theme) {
    return {
        MuiFab: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        boxShadow: 'none',
                        },
                    border: `8px solid ${theme.palette.primary.lighter}`
                },   
            }

        }
    }
}

