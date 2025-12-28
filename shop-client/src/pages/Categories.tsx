import { Alert, Box, Fab, Grid, Pagination, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '../components';
import { useAppContext } from '../context';
import { CategoryService } from '../services';
import { Category } from '../types';

const Categories = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const getCategories = () => {
        setLoading(true);
        setError(null);
        CategoryService.getCategories(pageSelected, 9)
            .then((res) => {
                setCategories(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .catch((error) => {
                setError(error.message || 'Unable to find categories');
                setCategories(null);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCategories();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Typography
                variant="h2"
                sx={{
                    typography: { xs: 'h4', sm: 'h3', md: 'h2' },
                }}
            >
                Les catégories
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Fab variant="extended" color="primary" aria-label="add" onClick={() => navigate('/category/create')}>
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une catégorie
                </Fab>
            </Box>

            {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}

            {/* Categories */}
            <Grid
                container
                alignItems="stretch"
                spacing={{ xs: 2, sm: 3, md: 4 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ width: '100%' }}
            >
                {categories?.map((category) => (
                    <Grid item key={category.id} xs={4}>
                        <CategoryCard category={category} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {categories?.length !== 0 ? (
                <Pagination count={count} page={page} siblingCount={1} onChange={handleChangePagination} />
            ) : (
                <Typography variant="h5" sx={{ mt: -1 }}>
                    Aucune catégorie correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Categories;
