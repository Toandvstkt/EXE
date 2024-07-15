import React, { Fragment, createContext } from "react";
import Layout from "../layout";
import { Grid } from '@mui/material';
import { styled } from '@mui/system';
import Carousel from 'react-material-ui-carousel';
import CategoryCardList from "./CategoryCardList";
import FeaturedItems from "./FeaturedItems";

export const HomeContext = createContext();

// Tạo StyledDiv để bọc toàn bộ nội dung và áp dụng padding
const StyledDiv = styled('div')({
  padding: '0 40px', // Thêm padding ở cả hai bên
});

const StyledImg = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  marginBottom: '1rem'
});

const banners = [
  { imageUrl: '/images/banners/banner-4.jpg' },
  { imageUrl: '/images/banners/banner-3.jpg' }
];

// const responsiveOneItemCarousel = {
//   // Configuration for responsiveness if needed
// };

const HomeComponent = () => {
  return (
    <Fragment>
      {/* Sử dụng StyledDiv để bọc toàn bộ nội dung và áp dụng padding */}
      <StyledDiv className='homepage'>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6} order={{ xs: 2, lg: 2 }}>
            <div className='home-carousel'>
              <Carousel
                swipeable={true}
                indicators={true}
                autoPlay={false}
                interval={3000}
              >
                {banners.map((item, index) => (
                  <StyledImg key={index} src={item.imageUrl} />
                ))}
              </Carousel>
            </div>
          </Grid>
          <Grid item xs={12} lg={3} order={{ xs: 1, lg: 1 }}>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <StyledImg src='/images/banners/banner-2.jpg' />
              <StyledImg src='/images/banners/banner-5.jpg' />
            </div>
          </Grid>
          <Grid item xs={12} lg={3} order={{ xs: 3, lg: 3 }}>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <StyledImg src='/images/banners/banner-2.jpg' />
              <StyledImg src='/images/banners/banner-6.jpg' />
            </div>
          </Grid>
        </Grid>
        <CategoryCardList/>
        <FeaturedItems/>
      </StyledDiv>
    </Fragment>
  );
};

const Home = (props) => {
  return (
    <Fragment>
      <Layout children={<HomeComponent />} />
    </Fragment>
  );
};

export default Home;
