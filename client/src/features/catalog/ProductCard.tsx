import {
  Card,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  Avatar,
} from "@mui/material";
import { Product } from "../../app/models/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <>
      <Card>
        <CardHeader 
          avatar={
            <Avatar sx={{bgcolor : 'secondary.dark'}}>
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
            sx:{fontWeight: 'bold', color: 'primary.main'}
          }}
          />
        <CardMedia
          sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" color='secondary.main'>
            ${(product.price/100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {product.brand}/{product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Add to cart</Button>
          <Button size="small">View</Button>
        </CardActions>
      </Card>
    </>
  );
}
