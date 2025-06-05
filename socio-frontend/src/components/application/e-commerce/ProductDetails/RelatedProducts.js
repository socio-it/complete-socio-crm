'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import Slider from 'react-slick';

// project imports
import ProductCard from 'components/ui-component/cards/ProductCard';
import { dispatch, useSelector } from 'store';
import { getRelatedProducts } from 'store/slices/product';

// ==============================|| PRODUCT DETAILS - RELATED PRODUCTS ||============================== //

const RelatedProducts = ({ id }) => {
  const [related, setRelated] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const { relatedProducts } = useSelector((state) => state.product);

  useEffect(() => {
    setRelated(relatedProducts);
  }, [relatedProducts]);

  useEffect(() => {
    dispatch(getRelatedProducts(id));
  }, [id]);

  useEffect(() => {
    if (downSM) {
      setItemsToShow(1);
      return;
    }
    if (downMD) {
      setItemsToShow(2);
      return;
    }
    if (downLG) {
      setItemsToShow(3);
      return;
    }
    if (downXL) {
      setItemsToShow(4);
    } else {
      setItemsToShow(5);
    }
  }, [downSM, downMD, downLG, downXL, itemsToShow]);

  const settings = {
    dots: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: '0px',
    slidesToShow: itemsToShow
  };

  let productResult = <></>;
  if (related) {
    productResult = related.map((product, index) => (
      <Box key={index} sx={{ p: 1.5 }}>
        <ProductCard
          key={index}
          id={product.id}
          image={product.image}
          name={product.name}
          offerPrice={product.offerPrice}
          salePrice={product.salePrice}
          rating={product.rating}
        />
      </Box>
    ));
  }

  return <Slider {...settings}>{productResult}</Slider>;
};

RelatedProducts.propTypes = {
  id: PropTypes.string
};

export default RelatedProducts;
