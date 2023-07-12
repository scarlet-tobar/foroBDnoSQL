import { Inter } from 'next/font/google'
import Header from '@/components/header'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })

export default function Registro() {
    return (
        <>
            <Header />
            <h2>
                Completa tus datos para registrarte.
            </h2>
            <form action="localhost:2000/registro" method="post" className={`${styles.form}`}>
                <label for="email">Correo</label>
                <input type="email" id="email" name="email" required/>
                <label for="nickname">Nick</label>
                <input type="text" id="nickname" name="nickname" required maxLength={15} />
                <label for="country">País</label>
                <select id='country' name='country' required>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Honduras">Honduras</option>
                    <option value="México">México</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Perú">Perú</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                </select>
                <label for="language">Idioma</label>
                <select id='language' name='language' required>
                    <option value='EN'>EN</option>
                    <option value='ES'>ES</option>
                </select>
                <label for='pasword'>Contraseña</label>
                <input type='password' id='password' name='password' required/>
                <button type="submit">Registrar</button>
            </form>
        </>
    )
}