import { useEffect, useRef, useState } from 'react'
import type { NextPage } from "next"
import { useSession } from 'next-auth/react'
import NextError from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import Modal from 'react-modal'
import { copyImage, downloadImage, downloadPdf } from '../../utils/element2image'
import { TrashIcon } from '@heroicons/react/solid'
import { PencilIcon } from '@heroicons/react/solid'
import { QrcodeIcon } from '@heroicons/react/outline'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { DownloadIcon } from '@heroicons/react/outline'
import { ClipboardCopyIcon } from '@heroicons/react/outline'

Modal.setAppElement('#__next')

const PostViewPage: NextPage = () => {
  const printRef = useRef<HTMLDivElement>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const userId = useSession().data?.user?.id
  const router = useRouter()
  const id = router.query.id as string

  const [urlForQRCode, setUrlForQRCode] = useState('')  
  useEffect(() => {
    setUrlForQRCode(window.location.href)
  }, [])

  const utils = trpc.useContext()
  const postQuery = trpc.useQuery(['post.byId', { id }])
  const commentsQuery = trpc.useQuery(['comments.byPostId', { id }])
  const addComment = trpc.useMutation('comments.add', {
    async onSuccess() {
      // refetches comments after a comment is added
      await utils.invalidateQueries(['comments.byPostId', { id }])
    },
  })
  const deleteComment = trpc.useMutation('comments.delete', {
    async onSuccess() {
      // refetches comments after a comment is deleted
      await utils.invalidateQueries(['comments.byPostId', { id }])
    },
  })
  const deletePost = trpc.useMutation('post.delete', {
    async onSuccess() {
      // redirect to posts page
      router.push('/posts')
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

  // modal

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleCopyImage = () => copyImage(printRef.current!)
  const handleDownloadImage = () => downloadImage(printRef.current!, 'QRCode', 'png')
  const handleDownloadPdf = () => downloadPdf(printRef.current!, 'QRCode')

  return (
    <>
      <Head>
        <title>LostAndFound - {`${data.title}`}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h2 className="text-lg font-bold mb-2" >Item details</h2>
        <div className="flex flex-col justify-between w-full p-2 rounded-md shadow-lg bg-white">
          <div className="flex justify-between">
            <h3 className="text-slate-900 text-xl leading-tight font-medium mr-2">
              {data.title}
            </h3>
            {userId === data.userId && (
              <>
                <div className="flex-1">
                  <button
                    className=''
                    onClick={() => { }}
                  >
                    <PencilIcon className="h-6 w-6 text-slate-600 hover:text-blue-500" />
                  </button>
                </div>
                <div className=''>
                  <button
                    className=''
                    onClick={() => deletePost.mutate({ id: data.id })}
                  >
                    <TrashIcon className="h-6 w-6 text-slate-600 hover:text-red-500" />
                  </button>
                </div>
              </>
            )}
          </div>


          <p className="text-xs italic">Added on {data.createdAt.toLocaleDateString()}</p>
          <p className="text-slate-700 text-base my-2 flex-1">
            {data.text}
          </p>
          <div>
            <button
              className='mr-2 flex items-center gap-1 mt-2 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'
              onClick={openModal}
            >
              <QrcodeIcon className="h-6 w-6" />
              QR Code
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mt-3" >Messages</h2>
      <ul>
        {commentsQuery.data?.map((comment) => (
          <li key={comment.id}>
            <div className={`flex ${userId == comment.userId ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex justify-between text-white my-2 p-2 min-w-full md:min-w-[60%] rounded-md shadow-lg ${userId == comment.userId ? 'bg-blue-500' : 'bg-green-500'}`}>
                <div>
                  <p className="font-bold">{comment.name}</p>
                  <p className='my-2'>{comment.text}</p>
                  <p className='text-xs italic text-gray-700'>{comment.createdAt.toLocaleString()}</p>
                </div>
                {userId === data.userId && (
                  <div>
                    <button
                      className=''
                      onClick={() => deleteComment.mutate({ id: comment.id })}
                    >
                      <TrashIcon className="h-6 w-6 text-white hover:text-red-500" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <h2 className="text-lg font-bold my-3" >Send a message</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            let nameSuffix: string
            userId ? nameSuffix = ' (Owner)' : nameSuffix = ' (Finder)'
            const $name: HTMLInputElement = (event as any).target.elements.name
            const $comment: HTMLInputElement = (event as any).target.elements.comment
            const input = {
              name: $name.value + nameSuffix,
              text: $comment.value,
              postId: id,
            }

            addComment.mutate(input)

            $name.value = ''
            $comment.value = ''
          }}
        >
          <div className='mb-2 flex flex-col'>
            {/* <label className='font-semibold' htmlFor="name">Name (optional)</label> */}
            <input
              className="w-48 p-2 rounded-md"
              id="name"
              type="text"
              name="name"
              placeholder='your name (optional)'
            />
          </div>
          <div className='mb-2 flex flex-col'>
            {/* <label className='font-semibold' htmlFor="comment">Message</label> */}
            <textarea
              className="w-96 p-2 rounded-md"
              id="comment"
              name="comment"
              placeholder="your message"
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // clicking on overlay or pressing ESC

        /** default styles (more or less) translated to tailwind */
        // overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-white/[.75]'
        // className='absolute top-10 left-10 right-10 bottom-10 border border-gray-600 rounded bg-gray-100 overflow-auto outline-none p-5'

        /** custom styles: the overlay has Modal as its only child, so it can be easily centered with flex */
        overlayClassName='fixed top-0 left-0 right-0 bottom-0 bg-black/[.75] flex justify-center items-center'
        className='border border-slate-600 rounded bg-slate-100 overflow-auto outline-none p-3'
      >

        <div ref={printRef} className='flex flex-col justify-center items-center border border-gray-600 rounded bg-white p-2'>
          <h2 className='text-green-600 text-lg font-bold mb-1'>{'Lost & Found'}</h2>
          <div>100% anonymous</div>
          <div>Scan to send a message to the owner.</div>
          {/* switched from QRCodeSVG to QRCodeCanvas because the image did not appear when downloading,
          we might switch back when we have a SVG logo instead of a PNG...*/}
          <QRCodeCanvas
          className='m-3' 
          value={urlForQRCode} 
          imageSettings={{
            src: '../../../logo.PNG',
            // src: 'http://localhost:3000/logo.PNG',
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
          />
        </div>

        <div className='flex justify-between'>
          <button
            className='flex items-center gap-1 mt-3 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={handleDownloadPdf}
          >
            <DownloadIcon className="h-6 w-6" />
            PDF
          </button>
          <button
            className='flex items-center gap-1 mt-3 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={handleDownloadImage}
          >
            <DownloadIcon className="h-6 w-6" />
            PNG
          </button>
          <button
            className='flex items-center gap-1 mt-3 px-2 py-1.5 bg-slate-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out'
            onClick={handleCopyImage}
          >
            <ClipboardCopyIcon className="h-6 w-6" />
            COPY
          </button>
        </div>

      </Modal>
    </>
  )
}

export default PostViewPage
