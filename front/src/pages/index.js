import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Header />
      <main className={`${styles.main},${inter.className}`}>
        <div>
          <h3>
            Inicia sesión
          </h3>
        </div>
        <div>
        <form action="localhost:2000/inicioSesion" method='post' className={`${styles.form}`}>
          <label for="email">
            Correo
            <input type="email" name="email" id='email' required ></input>
          </label>
          <label for="password">
            Contraseña
            <input type="password" name="password" id='password' required ></input>
          </label>
          <button type="submit">
            <label>
              Entrar
            </label>
          </button>
        </form>
      </div>
    </main >
    </>
  )
}
