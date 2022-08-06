import type { NextPage } from "next"
import NextError from 'next/error'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const PostViewPage: NextPage = () => {
  const id = useRouter().query.id as string
  const utils = trpc.useContext()
  const postQuery = trpc.useQuery(['post.byId', { id }])
  const commentsQuery = trpc.useQuery(['comments.byPostId', { id }])
  const addComment = trpc.useMutation('comments.add', {
    async onSuccess() {
      // refetches comments after a comment is added
      await utils.invalidateQueries(['comments.byPostId', { id }])
    },
  })

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    )
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>
  }
  const { data } = postQuery

  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-3" >Item details</h2>
        <div className="flex flex-col justify-between w-full p-3 rounded-md shadow-lg bg-white">
          <h3 className="text-slate-900 text-xl leading-tight font-medium">
            {data.title}
          </h3>
          <p className="text-xs italic">Added on {data.createdAt.toLocaleDateString()}</p>
          <p className="text-slate-700 text-base my-2 flex-1">
            {data.text}
          </p>
          <div>
            <button className='mr-2 inline-block my-2 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'>
              QR Code
            </button>
            <button className='mr-2 inline-block my-2 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'>
              Edit
            </button>
            <button className='mr-2 inline-block my-2 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'>
              Delete
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold my-3" >Messages</h2>
      <ul>
        {commentsQuery.data?.map((comment) => (
          <li key={comment.id}>
            <div className="text-white m-2 p-2 rounded-md shadow-lg bg-green-500">
              <p className="font-bold">{comment.name}</p>
              <p className='my-2'>{comment.text}</p>
              <p className='text-xs italic text-gray-700'>{comment.createdAt.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <h2 className="text-lg font-bold my-3" >Send a message</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const $name: HTMLInputElement = (event as any).target.elements.name
            const $comment: HTMLInputElement = (event as any).target.elements.comment
            const input = {
              name: $name.value,
              text: $comment.value,
              postId: id,
            }

            addComment.mutate(input)

            $name.value = ''
            $comment.value = ''
          }}
        >
          <div className='mb-2 flex flex-col'>
            <label className='font-semibold' htmlFor="name">Name (optional)</label>
            <input
              className="w-48 p-2 rounded-md"
              id="name"
              type="text"
              name="name"
              placeholder='Anonymous'
            />
          </div>
          <div className='mb-2 flex flex-col'>
            <label className='font-semibold' htmlFor="comment">Message</label>
            <textarea
              className="w-96 p-2 rounded-md"
              id="comment"
              name="comment"
              required
              maxLength={150}
              rows={3}
            >
            </textarea>
          </div>
          <input type="hidden" name="postId" value={id} />
          {/* <button type="submit">Send Message</button> */}
          <input
            className='inline-block my-2 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'
            type="submit"
          />
        </form>
      </div>
    </>
  )
}

export default PostViewPage