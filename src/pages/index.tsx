import type { NextPage } from "next"
import Head from "next/head"
import Link from 'next/link'
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
  const utils = trpc.useContext()
  const postsQuery = trpc.useQuery(['post.all'])
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.all'])
    },
  })

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);  

  return (
    <>
      <Head>
        <title>T3-ALL-V9</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1>Welcome to your T3 App starter!</h1>
        <p>
          Check <a href="https://trpc.io/docs">the tRPC docs</a>
        </p>

        <h2>
          Posts
          {postsQuery.status === 'loading' && '(loading)'}
        </h2>
        {postsQuery.data?.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <Link href={`/post/${item.id}`}>
              <a>View more</a>
            </Link>
          </article>
        ))}

        <hr />

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $text: HTMLInputElement = (e as any).target.elements.text
            const $title: HTMLInputElement = (e as any).target.elements.title
            const input = {
              title: $title.value,
              text: $text.value,
            }
            try {
              await addPost.mutateAsync(input)

              $title.value = ''
              $text.value = ''
            } catch { }
          }}
        >
          <label htmlFor="title">Title:</label>
          <br />
          <input
            id="title"
            name="title"
            type="text"
            disabled={addPost.isLoading}
          />

          <br />
          <label htmlFor="text">Text:</label>
          <br />
          <textarea id="text" name="text" disabled={addPost.isLoading} />
          <br />
          <input type="submit" disabled={addPost.isLoading} />
          {addPost.error && (
            <p style={{ color: 'red' }}>{addPost.error.message}</p>
          )}
        </form>
      </main>
    </>
  )
}

export default Home

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
