import React from "react";
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";

const AvisoDePrivacidad = () => {
  return (
    <>
      <HeaderGlobal />
      <div
        style={{
          paddingTop: "20px",

          fontFamily: "Poppins",

          maxWidth: "100%",
        }}
      >
        <div
          style={{
            width: "60%",

            textAlign: "justify",

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",

            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",

            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "5vw",
              fontWeight: "bold",
            }}
          >
            Aviso de Privacidad de Raffly
          </h1>

          <div>
            <h2>1. Introducción</h2>
            <p>
              En Raffly, nos comprometemos a proteger la privacidad de nuestros
              usuarios. Este aviso de privacidad describe cómo recopilamos,
              usamos, divulgamos y protegemos su información personal. Al
              utilizar nuestros servicios, usted acepta las prácticas descritas
              en este aviso de privacidad.
            </p>

            <h2>2. Información que Recopilamos</h2>
            <p>
              Podemos recopilar la siguiente información cuando se registra y
              utiliza nuestro sitio web:
            </p>
            <ul>
              <li>
                Información de contacto: nombre, dirección de correo
                electrónico, número de teléfono.
              </li>
              <li>Información de la cuenta: nombre de usuario, contraseña.</li>
              <li>
                Información de pago: detalles de la tarjeta de crédito u otros
                métodos de pago.
              </li>
              <li>
                Información de uso: detalles sobre cómo usa nuestros servicios,
                como las rifas que crea o en las que participa.
              </li>
            </ul>

            <h2>3. Uso de la Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proveer y mejorar nuestros servicios.</li>
              <li>Procesar transacciones y pagos.</li>
              <li>
                Comunicarnos con usted sobre su cuenta y nuestros servicios.
              </li>
              <li>Personalizar su experiencia en nuestro sitio web.</li>
              <li>Cumplir con las obligaciones legales.</li>
            </ul>

            <h2>4. Divulgación de la Información</h2>
            <p>
              No vendemos, alquilamos ni compartimos su información personal con
              terceros para sus propios fines de marketing sin su
              consentimiento. Podemos divulgar su información personal a
              terceros en las siguientes circunstancias:
            </p>
            <ul>
              <li>Para procesar pagos y completar transacciones.</li>
              <li>
                Para cumplir con leyes, regulaciones y órdenes judiciales.
              </li>
              <li>
                Para proteger nuestros derechos, propiedad y seguridad, así como
                los de nuestros usuarios y el público.
              </li>
            </ul>

            <h2>5. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad razonables para proteger su
              información personal contra el acceso no autorizado, la
              alteración, divulgación o destrucción. Sin embargo, no podemos
              garantizar la seguridad absoluta de su información.
            </p>

            <h2>6. Deslinde de Responsabilidad</h2>
            <p>
              Raffly actúa únicamente como un prestador de servicios que
              facilita la creación y gestión de rifas por parte de los usuarios.
              Raffly no es responsable del contenido, la veracidad, la legalidad
              o el resultado de las rifas creadas por los usuarios. Los
              organizadores de las rifas son los únicos responsables de cumplir
              con todas las leyes y regulaciones aplicables, así como de
              garantizar la entrega de premios y el cumplimiento de las
              condiciones de sus rifas.
            </p>

            <h2>7. Sus Derechos</h2>
            <p>
              Usted tiene derecho a acceder, corregir, actualizar o eliminar su
              información personal. También puede oponerse al procesamiento de
              su información en ciertas circunstancias. Para ejercer estos
              derechos, puede contactarnos a través de la información de
              contacto proporcionada en nuestro sitio web.
            </p>

            <h2>8. Cambios en el Aviso de Privacidad</h2>
            <p>
              Nos reservamos el derecho de actualizar este aviso de privacidad
              en cualquier momento. Le notificaremos sobre cualquier cambio
              significativo publicando el nuevo aviso de privacidad en nuestro
              sitio web. Su uso continuo de nuestros servicios después de dichos
              cambios constituye su aceptación del aviso de privacidad
              modificado.
            </p>

            <h2>9. Contacto</h2>
            <p>
              Si tiene alguna pregunta o inquietud sobre este aviso de
              privacidad, por favor contáctenos.
            </p>
          </div>
        </div>
      </div>

      <FooterGlobal />
    </>
  );
};

export default AvisoDePrivacidad;
