export default function Nosotros() {
    return (
      <section className="section">
        {/*<img
          src="/images/logito.png"
          alt="Logo de la empresa"
          className="company-logo light-effect"
        />{*/}
        <h2 className="light-effect">Sobre Nosotros</h2>
        <p>
          "En nuestra empresa, nos esforzamos por brindar experiencias
          gastronómicas excepcionales, fusionando calidad, innovación y un
          ambiente acogedor. Cada detalle está diseñado para superar las
          expectativas de nuestros clientes."
        </p>
  
        <h3>Contacto</h3>
        <p>Email: contacto@empresa.com</p>
        <p>Teléfono: +54 11 1234 5678</p>
  
        {/* Formulario de Contacto */}
        <h3>Contáctanos</h3>
        <form className="contact-form">
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" required />
  
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" required />
  
          <label htmlFor="message">Mensaje:</label>
          <textarea id="message" name="message" required></textarea>
  
          <button type="submit">Enviar</button>
        </form>
  
        {/* Redes Sociales */}
        <div className="social-media">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon light-effect"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon light-effect"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon light-effect"
          >
            <i className="fab fa-twitter"></i>
          </a>
        </div>
  
        <h3>Déjanos tu Opinión</h3>
        <p>Tu opinión es muy importante para nosotros. ¡Haz clic abajo para dejarnos tu comentario!</p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSezCLU9Vq8xEQMWgI9zaXFS4Wc3Ez4T9P5GeE64OtX9IYNLzQ/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="opinion-button light-effect"
        >
          Dejanos tu Opinión
        </a>
  
        {/* Mapa de Ubicación */}
        <h3>Ubicación</h3>
        <iframe
          src="https://www.google.com.ar/maps/place/1+de+Mayo+2100,+S3040ABB+San+Justo,+Santa+Fe/@-30.7851621,-60.5878754,17z/data=!3m1!4b1!4m5!3m4!1s0x944ad7d5d7388d77:0x8317267dd413f84!8m2!3d-30.7851667!4d-60.5853005?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
  
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </section>
    );
  }
  