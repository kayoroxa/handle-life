import Link from 'next/link'
import { AiFillPlayCircle } from 'react-icons/ai'

// https://images8.alphacoders.com/107/thumb-1920-1074175.png
/* eslint-disable @next/next/no-img-element */
export default function Poster({
  attendedDate,
  lessonName,
  imgSrc,
  orderModule,
  href,
}: {
  orderModule: number
  attendedDate: Date
  lessonName: string
  imgSrc: string
  href: string
}) {
  return (
    <main className="progress py-6 h-[350px] md:h-[450px] lg:h-[500px]  w-full max-w-[1300px] mx-auto relative group">
      <article className="absolute bottom-14 md:bottom-20 left-4 xl:left-20 lg:left-10 flex flex-col gap-6 max-w-xs xl:max-w-md z-40">
        <p className="xl:text-xl  flex gap-5 items-center">
          <span className="border border-sky-500 px-5 py-2 rounded-lg font-light">
            {attendedDate
              ? new Date(attendedDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>
          <span>Módulo {orderModule}</span>
        </p>
        <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold break-words z-20">
          {lessonName || '...'}
        </h2>
        <Link
          href={href}
          className=" text-base w-fit  px-8 py-2 md:px-10 md:py-4 rounded-3xl bg-sky-500 md:text-2xl  xl:text-3xl shadow-xl shadow-black/40 hover:bg-sky-600 hover:scale-105 hover:rounded-xl flex gap-4 justify-center items-center"
        >
          <AiFillPlayCircle /> <span>Continuar</span>
        </Link>
      </article>

      <div className="w-full h-full relative rounded-r-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-transparent absolute w-[65%] h-full z-10"></div>
        <img
          draggable={false}
          className="group-hover:scale-[102%] lg:rounded-l-none h-full w-[99%] ml-auto min-h-full object-cover  "
          src={imgSrc}
          alt=""
        />
      </div>
    </main>
  )
}
