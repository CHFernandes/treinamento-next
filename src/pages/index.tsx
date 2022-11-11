import Image from 'next/future/image'
import { HomeContainer, Product } from '../styles/pages/home'

import { stripe } from '../lib/stripe'
import { GetStaticProps } from 'next'
import Stripe from 'stripe'
import Link from 'next/link'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

interface Product {
  id: string
  name: string
  imageUrl: string
  price: string
}

interface HomeProps {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  return (
    <>
      <NextSeo
        title='Home | Training Shop'
        description='Home'
        openGraph={{
          type: 'website',
          title: 'Home | Training Shop',
          description: 'Home',
        }}
      />

      <HomeContainer>
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Product>
              <Image src={product.imageUrl} width={380} height={310} alt='' />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount / 100),
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}
