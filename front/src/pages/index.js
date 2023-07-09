import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Forito</title>
        <meta name="description" content="Un foro básico puro texto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
      <h1 className={styles.title}>
        Forito
      </h1>
        <h2> 
          Bienvenido al forito.
        </h2>
        <div>
          <h3>
            Inicia sesión
          </h3>
        <form>
          <label>
            Correo
          <input type="email" name="Correo" ></input>
          </label>
          <label>
            Contraseña
          <input type="password" name="Contraseña" ></input>
          </label>
        </form>

        </div>
      </main>
    </>
  )
}
