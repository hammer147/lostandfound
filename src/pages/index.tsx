import type { NextPage } from "next"
import Head from "next/head"
import Link from 'next/link'
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>LostAndFound - Home</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center">
        <h1>Welcome to LostAndFound!</h1>
      </main>
    </>
  )
}

export default Home
