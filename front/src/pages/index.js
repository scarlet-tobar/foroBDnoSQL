import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header/>
      <main className={`${styles.main} ${inter.className}`}>
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
          <button >
            <label>
              Entrar
            </label>
          </button>
        </form>
        </div>
      </main>
    </>
  )
}
