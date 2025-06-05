'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import ProductImages from 'components/application/e-commerce/ProductDetails/ProductImages';
import ProductInfo from 'components/application/e-commerce/ProductDetails/ProductInfo';
import ProductDescription from 'components/application/e-commerce/ProductDetails/ProductDescription';
import ProductReview from 'components/application/e-commerce/ProductDetails/ProductReview';
import RelatedProducts from 'components/application/e-commerce/ProductDetails/RelatedProducts';

import Loader from 'components/ui-component/Loader';
import Chip from 'components/ui-component/extended/Chip';
import MainCard from 'components/ui-component/cards/MainCard';
import FloatingCart from 'components/ui-component/cards/FloatingCart';

import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getProduct } from 'store/slices/product';
import { resetCart } from 'store/slices/cart';

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`product-details-tabpanel-${index}`}
      aria-labelledby={`product-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `product-details-tab-${index}`,
    'aria-controls': `product-details-tabpanel-${index}`
  };
}

const ProductDetails = ({ id }) => {
  const params = useParams();
  const { menuMaster } = useGetMenuMaster();

  const cart = useSelector((state) => state.cart);
  const { product } = useSelector((state) => state.product);

  const [loading, setLoading] = useState(true);

  // product description tabs
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getProduct(id)).then(() => setLoading(false));

    // clear cart if complete order
    if (cart.checkout.step > 2) {
      dispatch(resetCart());
    }
  }, [cart.checkout.step, id]);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [id]);

  useEffect(() => {
    if (menuMaster.openedItem !== 'product-details') handlerActiveItem('product-details');
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loader />;

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12} lg={10}>
        <MainCard>
          {product && product?.id === Number(id) && (
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={6}>
                <ProductImages product={product} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductInfo product={product} />
              </Grid>
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  indicatorColor="primary"
                  onChange={handleChange}
                  aria-label="product description tabs example"
                  sx={{ '& a > svg': { mb: '0px !important', mr: 1.25 } }}
                  variant="scrollable"
                >
                  <Tab label="Description" {...a11yProps(0)} />
                  <Tab
                    label={
                      <Stack direction="row" alignItems="center">
                        Reviews <Chip label={String(product.offerPrice?.toFixed(0))} size="small" chipcolor="secondary" sx={{ ml: 1.5 }} />
                      </Stack>
                    }
                    {...a11yProps(1)}
                  />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <ProductDescription />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ProductReview product={product} />
                </TabPanel>
              </Grid>
            </Grid>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
        <Typography variant="h2">Related Products</Typography>
      </Grid>
      <Grid item xs={11} lg={10}>
        <RelatedProducts id={params?.id?.toString()} />
      </Grid>
      <FloatingCart />
    </Grid>
  );
};

ProductDetails.propTypes = {
  id: PropTypes.string
};

export default ProductDetails;
