import React from "react";
import Hero from "../components/HomeComponent/Hero";
import FeaturedPosts from "../components/HomeComponent/FeaturedPosts";
import LatestPosts from "../components/HomeComponent/LatestPosts";
import Tags from "../components/HomeComponent/Tags";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedPosts />
      <LatestPosts />
      <Tags />
    </div>
  );
};

export default Home;
