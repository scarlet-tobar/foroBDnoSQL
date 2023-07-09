import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function Header() {
    return (
        <>
            <Head>
                <title>Forito</title>
                <meta name="description" content="Un foro básico puro texto" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${styles.main} ${inter.className}`}>
                <h1 className={styles.title}>
                    Forito
                </h1>
                <h2>
                    Bienvenido al forito.
                </h2>
            </div>
        </>
    )
}