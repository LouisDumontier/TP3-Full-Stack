import { CategoryService, ProductService } from '../services';
import { useEffect, useState } from 'react';
import { Category, Product, ResponseArray } from '../types';
import { Box, FormControl, Grid, Pagination, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { useAppContext } from '../context';
import SelectPaginate from './SelectPaginate';

type Props = {
    shopId: string;
};

const ShopProducts = ({ shopId }: Props) => {
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);
    const [filter, setFilter] = useState<Category | null>(null);

    const getProducts = () => {
        setLoading(true);
        let promisedProducts: Promise<ResponseArray<Product>>;

        if (filter && filter.name !== 'Toutes les catégories') {
            promisedProducts = ProductService.getProductsbyShopAndCategory(shopId, filter.id, pageSelected, 6);
        } else {
            promisedProducts = ProductService.getProductsbyShop(shopId, pageSelected, 6);
        }

        promisedProducts
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .catch((err) => {
                console.error('Error loading products:', err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [shopId, pageSelected, filter]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 3, sm: 4, md: 5 },
            }}
        >
            {/* Filters */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                }}
            >
                <FormControl
                    sx={{
                        minWidth: { xs: '100%', sm: 220 },
                        maxWidth: { xs: 400, sm: 'none' },
                    }}
                >
                    <SelectPaginate
                        value={filter}
                        onChange={setFilter}
                        placeholder="Catégorie"
                        refetch={CategoryService.getCategories}
                        defaultLabel="Toutes les catégories"
                    />
                </FormControl>
            </Box>

            {/* Products Grid */}
            <Grid container alignItems="stretch" spacing={{ xs: 2, sm: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {products?.map((product) => (
                    <Grid item key={product.id} xs={4} sm={4} md={4}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination or Empty Message */}
            {products?.length !== 0 ? (
                <Pagination
                    count={count}
                    page={page}
                    // siblingCount={{ xs: 0, sm: 1 }}
                    // size={{ xs: 'small', sm: 'medium' }}
                    onChange={handleChangePagination}
                    sx={{
                        '& .MuiPagination-ul': {
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        },
                    }}
                />
            ) : (
                <Typography
                    variant="h6"
                    sx={{
                        mt: { xs: -2, sm: -3, md: -4 },
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        textAlign: 'center',
                        px: 2,
                    }}
                >
                    Aucun produit correspondant
                </Typography>
            )}
        </Box>
    );
};

export default ShopProducts;
