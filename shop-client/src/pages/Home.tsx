import {
    Alert,
    Box,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filters, ShopCard } from '../components';
import { useAppContext } from '../context';
import { ShopService } from '../services';
import { ResponseArray, Shop } from '../types';

const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [filters, setFilters] = useState<string>('');
    const [searchLabel, setSearchLabel] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const getShops = () => {
        setLoading(true);
        setError(null);

        let combinedParams = '';

        if (sort) {
            combinedParams += `&sortBy=${sort}`;
        }

        if (searchLabel) {
            combinedParams += `&label=${searchLabel}`;
        }

        if (filters) {
            combinedParams += filters;
        }

        if (combinedParams.startsWith('&')) {
            combinedParams = combinedParams.substring(1);
        }

        const promisedShops = combinedParams
            ? ShopService.getShopsFiltered(pageSelected, 9, '&' + combinedParams)
            : ShopService.getShops(pageSelected, 9);

        promisedShops
            .then((res) => {
                setShops(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .catch((err) => {
                setError(err.message || 'Unable to find shops');
                setShops(null);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getShops();
    }, [pageSelected, sort, filters, searchLabel]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    const handleChangeSort = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
    };

    const handleChangeSearchLabel = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchLabel(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Typography
                variant="h2"
                sx={{
                    typography: { xs: 'h4', sm: 'h3', md: 'h2' },
                }}
            >
                Les boutiques
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate('/shop/create')}
                    variant="extended"
                    sx={{
                        '& .MuiFab-label': {
                            display: { xs: 'none', sm: 'flex' },
                        },
                        minWidth: { xs: 56, sm: 'auto' }, // Circle on mobile, extended on desktop
                    }}
                >
                    <AddIcon sx={{ mr: { xs: 0, sm: 1 } }} />
                    <span>Ajouter une boutique</span>
                </Fab>
            </Box>

            {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}

            {/* Sort and filters */}
            <TextField
                fullWidth
                id="filled-basic"
                label="Rechercher"
                variant="outlined"
                value={searchLabel}
                onChange={handleChangeSearchLabel}
            />
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">Trier par</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Trier par"
                        onChange={handleChangeSort}
                    >
                        <MenuItem value="">
                            <em>Aucun</em>
                        </MenuItem>
                        <MenuItem value="name">Nom</MenuItem>
                        <MenuItem value="createdAt">Date de création</MenuItem>
                        <MenuItem value="nbProducts">Nombre de produits</MenuItem>
                    </Select>
                </FormControl>

                <Filters setUrlFilters={setFilters} setSort={setSort} sort={sort} />
            </Box>

            {/* Shops */}
            <Grid container alignItems="center" spacing={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                {shops?.map((shop) => (
                    <Grid item key={shop.id} xs={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {shops?.length !== 0 ? (
                <Pagination count={count} page={page} siblingCount={1} onChange={handleChangePagination} />
            ) : (
                <Typography variant="h5" sx={{ mt: -1 }}>
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;
