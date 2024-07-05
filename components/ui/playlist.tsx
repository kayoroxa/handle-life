'use client'
import { cn } from '@/lib/utils'
import { T_Lesson } from '@/types/content-types'
import { useState } from 'react'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { GiPadlock } from 'react-icons/gi'
import { GoPlay } from 'react-icons/go'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

interface IPropsModuleHeader {
  moduleInfo: {
    name: string
    order: number
    link?: string
  }
  shadow?: boolean
  arrow?: '<' | '>'
  onClick?: () => void
  className?: string
}

function Header({
  moduleInfo,
  shadow = true,
  arrow,
  onClick,
  className,
}: IPropsModuleHeader) {
  let myClass =
    'p-4 bg-gray-600 flex gap-6 items-center border-separate border border-gray-500 border-opacity-30 '

  if (shadow) myClass += ' drop-shadow-xl'
  if (moduleInfo.link) myClass += ' hover:cursor-pointer hover:bg-gray-500'

  return (
    <div className={cn(myClass, className)} onClick={onClick}>
      {arrow && (
        <div id="icon" className="h-full text-3xl">
          <div id="cadeado" className="wrapper-icon h-7">
            {arrow === '<' ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
          </div>
        </div>
      )}
      <div>
        <div id="name">{moduleInfo.name}</div>
        <div id="index" className=" text-sky-300 font-bold">
          Módulo: {('000' + moduleInfo.order).slice(-3)}
        </div>
      </div>
    </div>
  )
}

function Footer({
  nextModule,
  prevModule,
}: {
  nextModule?: {
    name: string
    order: number
    slug: string
    onCLick: () => void
  }
  prevModule?: {
    name: string
    order: number
    slug: string
    onCLick: () => void
  }
}) {
  return (
    <div className="w-full drop-shadow-xl">
      {nextModule && (
        <Header
          className="hover:cursor-pointer hover:bg-gray-500/60"
          moduleInfo={{
            name: 'Proximo módulo',
            order: nextModule.order,
          }}
          onClick={nextModule.onCLick}
          shadow={false}
          arrow=">"
        />
      )}
      {prevModule && (
        <Header
          className="hover:cursor-pointer hover:bg-gray-500/60"
          moduleInfo={{
            name: 'Voltar ao módulo anterior',
            order: prevModule.order,
            link: '/modulo/' + prevModule?.slug,
          }}
          onClick={prevModule.onCLick}
          shadow={false}
          arrow="<"
        />
      )}
    </div>
  )
}

function ItemList({
  lesson,
  onVideoClick,
  isSelected,
  index,
  onLessonSetDone,
}: {
  lesson: T_Lesson
  onVideoClick: (lesson: T_Lesson) => void
  isSelected: boolean
  index: number
  onLessonSetDone: (lessonId: number, done: boolean) => void
}) {
  const [lessonDone, setLessonDone] = useState(lesson.done)

  return (
    <li
      key={lesson.id}
      onClick={() => onVideoClick(lesson)}
      className={cn(
        `flex gap-3 px-4 py-5 border-separate border border-gray-600 border-opacity-30 items-center`,
        !lesson.archived
          ? 'hover:cursor-pointer'
          : 'hover:cursor-not-allowed opacity-30 border-opacity-90',
        lessonDone && 'bg-green-600/10',
        isSelected
          ? `opacity-100 ${lessonDone ? 'bg-green-500' : 'bg-blue-500'}`
          : 'opacity-80'
      )}
    >
      <div
        id="aula-numero"
        className={cn(
          `text-3xl py-2 px-3  text-gray-800 rounded-xl`,
          isSelected ? 'bg-blue-300' : 'bg-gray-500',
          lessonDone && 'bg-green-300'
        )}
      >
        {index + 1}
      </div>
      <div className="flex flex-col flex-1">
        <p className=" text-lg capitalize">
          {lesson.title}| {lesson.youtubeId}
        </p>
        <p className=" text-xs">{lesson ? '15:05' : 'em breve'}</p>
      </div>

      {!isSelected && !lessonDone && (
        <div className="h-7">
          <GoPlay className="w-full h-full" />
        </div>
      )}

      {isSelected && !lessonDone && (
        <div className="h-7">
          <MdCheckBoxOutlineBlank
            className="w-full h-full scale-125 hover:scale-[180%]"
            onClick={() => {
              setLessonDone(true)
              onLessonSetDone(lesson.id, true)
            }}
          />
        </div>
      )}

      {lessonDone && (
        <div className="h-7 hover:block">
          <MdCheckBox
            className="w-full h-full scale-125 hover:scale-[180%]"
            onClick={() => {
              setLessonDone(false)
              onLessonSetDone(lesson.id, false)
            }}
          />
        </div>
      )}

      {lesson.archived === true && (
        <div id="cadeado" className="h-7">
          <GiPadlock className="w-full h-full" />
        </div>
      )}
    </li>
  )
}

function Items({
  lessons,
  onItemClick,
  lessonSelectedId,
  onLessonSetDone,
}: {
  lessons: T_Lesson[]
  onItemClick: (lesson: T_Lesson) => void
  lessonSelectedId: T_Lesson['id']
  onLessonSetDone: (lessonId: T_Lesson['id'], done: boolean) => void
}) {
  return (
    <div id="wrapper-tiras" className="pb-5">
      {lessons.map((lesson, i) => (
        <ItemList
          onLessonSetDone={onLessonSetDone}
          key={lesson.id}
          lesson={lesson}
          onVideoClick={onItemClick}
          isSelected={lesson.id === lessonSelectedId}
          index={i}
        />
      ))}
    </div>
  )
}

function Root({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="flex flex-col  w-full bg-gray-700 rounded-2xl overflow-hidden shadow-xl text-white">
      {children}
    </ul>
  )
}

const PlayList = {
  Root,
  Footer,
  Header,
  Items,
}

export default PlayList
