import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';

type Props = {
    category: Category;
};

const CategoryCard = ({ category }: Props) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
                cursor: 'pointer',
            }}
            onClick={() => navigate(`/category/${category.id}`)}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    }}
                >
                    {category.name}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;
