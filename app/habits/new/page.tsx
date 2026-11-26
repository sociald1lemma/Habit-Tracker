import type { Metadata } from 'next'
import Editor from '@/components/editor'
export const metadata: Metadata = {
  title: 'Создание новой привычки',
  description: 'Добавьте привычку, выберите категорию, значок и цель выполнения на неделю.',
}

export default function New(){return <><h1>Новая привычка</h1><Editor/></>}
