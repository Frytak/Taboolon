'use client'
import style from './page.module.css'

import Credentials from '@/components/Credentials/Credentials'
import Info from '@/components/Info/Info'
import Converter from '@/components/Converter/Converter'

export default function Home() {

  return (
    <main className={style.main}>
      <Info className={style.info} />
      <Converter className={style.converter}/>
      <Credentials className={style.credentials} />
    </main>
  )
}
