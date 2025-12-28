import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';

type Props = {
    children: JSX.Element;
};

const navItems = [
    { label: 'Boutiques', path: '/' },
    { label: 'Produits', path: '/product' },
    { label: 'Catégories', path: '/category' },
];

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Gestion de boutiques
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavigate(item.path)}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar component="nav" position="fixed">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        onClick={() => navigate('/')}
                        sx={{
                            cursor: 'pointer',
                            flexGrow: isMobile ? 1 : 0,
                            mr: isMobile ? 0 : 4,
                        }}
                    >
                        Gestion de boutiques
                    </Typography>

                    {!isMobile && (
                        <>
                            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                                {navItems.map((item) => (
                                    <Button key={item.label} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                            <Box>
                                <SwitchLanguage />
                            </Box>
                        </>
                    )}

                    {isMobile && (
                        <Box>
                            <SwitchLanguage />
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>

            <Loader />

            <Container
                component="main"
                maxWidth="xl"
                sx={{
                    mt: { xs: 10, sm: 12 },
                    mb: 4,
                    px: { xs: 2, sm: 3, md: 4 },
                    flexGrow: 1,
                }}
            >
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
