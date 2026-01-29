import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import ProductSearch from '../components/Search/ProductSearch';

const SearchPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Recherche de produits - Kamba Lhains</title>
        <meta 
          name="description" 
          content="Recherchez et filtrez votre produit idéal parmi notre collection Kamba Lhains. Trouvez facilement vos vêtements par catégorie, prix et style." 
        />
        <meta name="keywords" content="recherche, produits, mode, vêtements, Kamba Lhains, filtres" />
      </Head>
      
      <main>
        <ProductSearch />
      </main>
    </Layout>
  );
};

export default SearchPage;