
Spec: Cuentas y acceso
Purpose
Permitir que una persona cree una cuenta, inicie y cierre sesión y consulte su perfil, y garantizar que sin una sesión válida no se pueda acceder a las áreas protegidas, ni desde la API ni desde la interfaz.
Requirements
Requirement: Registro de cuenta por API
El sistema SHALL permitir crear una cuenta mediante POST /api/v1/auth/signup y SHALL devolver en la misma respuesta los datos del usuario y un token de acceso válido.
Scenario: Registro con datos válidos

- WHEN un cliente sin autenticar envía nombre, un email no registrado y con formato válido, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica a la contraseña
- THEN la respuesta es 200 con un cuerpo { data: { user, token } }, y ese token permite acceder a los endpoints protegidos sin iniciar sesión aparte
Scenario: Registro sin nombre

- WHEN un cliente envía el campo de nombre con valor null o como cadena vacía y el resto de campos válidos
- THEN la cuenta se crea y el usuario devuelto tiene el nombre a null
Requirement: El campo de nombre debe estar presente en el registro
El sistema SHALL rechazar un registro cuya petición no incluya el campo de nombre, aunque su valor pueda ser nulo.
Scenario: Petición sin el campo de nombre

- WHEN un cliente envía email, contraseña y confirmación válidos pero omite por completo el campo de nombre
- THEN la respuesta es 422 con un error de regla required sobre el campo fullName
Requirement: Validación del email en el registro
El sistema SHALL exigir en el registro un email con formato válido, de 254 caracteres como máximo y que no pertenezca a una cuenta existente.
Scenario: Email con formato inválido

- WHEN un cliente envía un registro con un email sin formato de email
- THEN la respuesta es 422 con un error de regla email sobre el campo email
Scenario: Email ya registrado

- WHEN un cliente envía un registro con un email que ya pertenece a una cuenta
- THEN la respuesta es 422 con un error de regla database.unique sobre el campo email, y no se crea ninguna cuenta
Scenario: Email demasiado largo

- WHEN un cliente envía un registro con un email de más de 254 caracteres
- THEN la respuesta es 422 con un error de regla maxLength sobre el campo email
Requirement: Validación de la contraseña en el registro
El sistema SHALL exigir en el registro una contraseña de entre 8 y 32 caracteres y una confirmación que cumpla las mismas reglas y coincida con ella.
Scenario: Contraseña demasiado corta

- WHEN un cliente envía un registro con una contraseña de menos de 8 caracteres
- THEN la respuesta es 422 con un error de regla minLength sobre el campo password
Scenario: Contraseña demasiado larga

- WHEN un cliente envía un registro con una contraseña de más de 32 caracteres
- THEN la respuesta es 422 con un error de regla maxLength sobre el campo password
Scenario: Confirmación distinta

- WHEN un cliente envía un registro cuya confirmación no coincide con la contraseña
- THEN la respuesta es 422 con un error de regla sameAs sobre el campo passwordConfirmation
Requirement: Formato de los errores de validación
El sistema SHALL responder a los errores de validación con código 422 y un cuerpo { errors: [...] }, donde cada error indica un mensaje, la regla incumplida y el campo afectado.
Scenario: Varios campos inválidos a la vez

- WHEN un cliente envía un registro con varios campos inválidos
- THEN la respuesta es 422 y la lista errors contiene un elemento por cada problema, cada uno con message, rule y field
Requirement: La contraseña nunca se expone
El sistema SHALL omitir la contraseña, en cualquier forma, de todas las representaciones del usuario que devuelve.
Scenario: Respuesta de registro, login o perfil

- WHEN un cliente recibe los datos de un usuario en la respuesta de registro, de login o de perfil
- THEN esos datos no incluyen ningún campo de contraseña
Requirement: Inicio de sesión por API
El sistema SHALL permitir iniciar sesión mediante POST /api/v1/auth/login con email y contraseña, y SHALL emitir un token nuevo en cada inicio de sesión correcto.
Scenario: Credenciales correctas

- WHEN un cliente envía el email y la contraseña de una cuenta existente
- THEN la respuesta es 200 con un cuerpo { data: { user, token } }
Scenario: Varios inicios de sesión

- WHEN un mismo usuario inicia sesión varias veces y obtiene varios tokens
- THEN todos esos tokens siguen siendo válidos a la vez
Requirement: Rechazo de credenciales incorrectas
El sistema SHALL rechazar con código 400 un inicio de sesión con credenciales incorrectas, y la respuesta SHALL ser la misma tanto si el email no existe como si la contraseña es errónea.
Scenario: Contraseña incorrecta

- WHEN un cliente envía un email registrado con una contraseña que no le corresponde
- THEN la respuesta es 400 y no se emite ningún token
Scenario: Email no registrado

- WHEN un cliente envía un email con formato válido que no pertenece a ninguna cuenta
- THEN la respuesta es 400, igual que con una contraseña incorrecta, y no se emite ningún token
Requirement: Validación de la petición de inicio de sesión
El sistema SHALL validar el formato de la petición de inicio de sesión antes de comprobar las credenciales.
Scenario: Email con formato inválido

- WHEN un cliente envía un inicio de sesión con un email sin formato de email
- THEN la respuesta es 422 con un error sobre el campo email, no un 400
Scenario: Contraseña ausente

- WHEN un cliente envía un inicio de sesión sin contraseña
- THEN la respuesta es 422 con un error de regla required sobre el campo password
Requirement: Autenticación por token
El sistema SHALL autenticar las peticiones a los endpoints protegidos mediante la cabecera Authorization: Bearer , usando un token emitido en un registro o en un inicio de sesión.
Scenario: Token válido

- WHEN un cliente llama a un endpoint protegido con un token emitido y no revocado
- THEN la petición se atiende como hecha por el usuario dueño del token
Scenario: Token sin caducidad

- WHEN un cliente usa un token emitido hace tiempo que no se ha revocado con un cierre de sesión
- THEN el token sigue siendo válido
Requirement: Cierre de sesión por API
El sistema SHALL permitir cerrar sesión mediante POST /api/v1/account/logout, y SHALL revocar únicamente el token con el que se hace la petición.
Scenario: Cierre de sesión con token válido

- WHEN un cliente autenticado llama al endpoint de cierre de sesión
- THEN la respuesta es 200 con el cuerpo { message: 'Logged out successfully' }, sin el envoltorio data, y a partir de ahí ese token recibe 401 en los endpoints protegidos
Scenario: Otros tokens del mismo usuario

- WHEN un usuario con varios tokens activos cierra sesión con uno de ellos
- THEN sus demás tokens siguen siendo válidos
Requirement: Consulta del perfil por API
El sistema SHALL devolver, mediante GET /api/v1/account/profile, los datos del usuario autenticado: identificador, nombre, email, fecha de creación, fecha de actualización e iniciales.
Scenario: Perfil del usuario autenticado

- WHEN un cliente autenticado solicita su perfil
- THEN la respuesta es 200 con { data: { id, fullName, email, createdAt, updatedAt, initials } } del dueño del token
Requirement: Cálculo de las iniciales
El sistema SHALL calcular las iniciales en mayúsculas a partir del nombre y, cuando no hay nombre, a partir del email.
Scenario: Nombre con dos o más palabras

- WHEN el usuario tiene un nombre de al menos dos palabras separadas por espacio, por ejemplo «Ada Lovelace»
- THEN las iniciales son la primera letra de cada una de las dos primeras palabras, en este caso «AL»
Scenario: Nombre de una sola palabra

- WHEN el usuario tiene un nombre de una sola palabra, por ejemplo «Ada»
- THEN las iniciales son sus dos primeras letras en mayúsculas, en este caso «AD»
Scenario: Usuario sin nombre

- WHEN el usuario no tiene nombre y su email es, por ejemplo, «juan@example.com»
- THEN las iniciales son la primera letra de la parte anterior a la arroba y la primera del dominio, en este caso «JE»
Requirement: Protección de los endpoints de cuenta
El sistema SHALL responder con 401 a cualquier petición sin un token válido dirigida a los endpoints de perfil y de cierre de sesión.
Scenario: Sin token

- WHEN un cliente llama al perfil o al cierre de sesión sin cabecera de autorización
- THEN la respuesta es 401
Scenario: Token inválido o revocado

- WHEN un cliente llama al perfil o al cierre de sesión con un token inexistente o ya revocado
- THEN la respuesta es 401
Requirement: Endpoints de registro e inicio de sesión públicos
El sistema SHALL permitir el acceso a los endpoints de registro e inicio de sesión sin autenticación.
Scenario: Petición anónima

- WHEN un cliente sin token llama al registro o al inicio de sesión con datos válidos
- THEN la petición se procesa con normalidad
Requirement: Respuestas en JSON
El sistema SHALL responder en JSON a todas las peticiones de la API, también a las de error, sea cual sea la cabecera Accept que envíe el cliente.
Scenario: Error sin Accept JSON

- WHEN un cliente sin token y sin cabecera Accept: application/json llama a un endpoint protegido
- THEN la respuesta 401 tiene cuerpo JSON
Requirement: Formulario de registro
La interfaz SHALL ofrecer en /register un formulario con nombre completo (marcado como opcional), email, contraseña con la indicación «Entre 8 y 32 caracteres.» y repetición de la contraseña, más un enlace «Inicia sesión» que lleva a /login.
Scenario: Visitante abre el registro

- WHEN una persona sin sesión abre /register
- THEN ve el título «Crea tu cuenta», los cuatro campos, el botón «Crear cuenta» y el enlace a inicio de sesión
Requirement: Comprobación local de las contraseñas en el registro
La interfaz SHALL comprobar que la contraseña y su repetición coinciden antes de enviar el registro, y SHALL no enviar nada al servidor si no coinciden.
Scenario: Contraseñas distintas

- WHEN una persona rellena el registro con dos contraseñas distintas y lo envía
- THEN aparece «Las contraseñas no coinciden.» bajo el campo de repetición y no se hace ninguna petición al servidor
Requirement: Registro correcto desde la interfaz
La interfaz SHALL iniciar sesión automáticamente tras un registro correcto y SHALL llevar a la persona a su perfil.
Scenario: Registro correcto

- WHEN una persona sin sesión completa el registro con datos válidos
- THEN queda con la sesión iniciada y llega a /profile
Scenario: Nombre en blanco

- WHEN una persona deja el nombre vacío o con solo espacios y completa el registro
- THEN la cuenta se crea sin nombre
Requirement: Errores de validación en la interfaz
La interfaz SHALL mostrar los errores de validación del servidor en castellano, debajo del campo al que corresponden.
Scenario: Email ya registrado

- WHEN una persona intenta registrarse con un email que ya tiene cuenta
- THEN bajo el campo de email aparece «Ese email ya está registrado. Inicia sesión en su lugar.»
Scenario: Email con formato inválido

- WHEN una persona envía el formulario de registro o de inicio de sesión con un email sin formato válido
- THEN bajo el campo de email aparece «Introduce una dirección de email válida.»
Scenario: Contraseña demasiado corta

- WHEN una persona intenta registrarse con una contraseña de menos de 8 caracteres
- THEN bajo el campo de contraseña aparece «la contraseña debe tener al menos 8 caracteres.»
Scenario: Campo obligatorio vacío

- WHEN una persona envía un formulario con un campo obligatorio vacío, por ejemplo el email
- THEN bajo ese campo aparece «Falta rellenar el email.» o el texto equivalente para ese campo
Requirement: Formulario de inicio de sesión
La interfaz SHALL ofrecer en /login un formulario con email y contraseña, y un enlace «Crea una» que lleva a /register.
Scenario: Visitante abre el inicio de sesión

- WHEN una persona sin sesión abre /login
- THEN ve el título «Inicia sesión», los campos de email y contraseña, el botón «Entrar» y el enlace al registro
Requirement: Inicio de sesión desde la interfaz
La interfaz SHALL iniciar sesión con credenciales correctas y llevar a la persona a su perfil, y con credenciales incorrectas SHALL mostrar un error comprensible sin dar acceso.
Scenario: Credenciales correctas

- WHEN una persona sin sesión envía un email y una contraseña correctos
- THEN queda con la sesión iniciada y llega a /profile
Scenario: Credenciales incorrectas

- WHEN una persona envía un email o una contraseña incorrectos
- THEN sigue en /login y ve un aviso con «El email o la contraseña no son correctos.»
Requirement: Estado de envío de los formularios
La interfaz SHALL deshabilitar el botón de envío mientras se procesa un registro o un inicio de sesión, y SHALL indicarlo con un texto de progreso.
Scenario: Envío en curso

- WHEN una persona envía el registro o el inicio de sesión y el servidor aún no ha respondido
- THEN el botón está deshabilitado y muestra «Creando cuenta…» o «Entrando…», según el formulario
Requirement: Errores de conexión y de servidor en la interfaz
La interfaz SHALL mostrar un aviso general comprensible cuando el servidor no responde o devuelve un error inesperado.
Scenario: Servidor inaccesible

- WHEN una persona envía el registro o el inicio de sesión y el servidor no responde
- THEN aparece el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»
Scenario: Error inesperado del servidor

- WHEN el servidor responde a un registro o a un inicio de sesión con un error que no es de validación, de credenciales ni de autenticación
- THEN aparece el aviso «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»
Requirement: Persistencia de la sesión en la interfaz
La interfaz SHALL mantener la sesión al recargar la página y al cerrar y volver a abrir la pestaña, validándola contra el servidor al arrancar.
Scenario: Recarga con sesión válida

- WHEN una persona con la sesión iniciada recarga la página o vuelve a abrir la aplicación
- THEN ve un indicador de carga mientras se valida la sesión y después sigue con la sesión iniciada, sin pasar por /login
Requirement: Pérdida de la sesión al arrancar
La interfaz SHALL llevar a la persona a /login y explicarle el motivo cuando no puede restaurar una sesión guardada.
Scenario: El servidor rechaza la sesión guardada

- WHEN una persona abre la aplicación con una sesión guardada cuyo token el servidor ya no acepta
- THEN llega a /login con el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.», y la sesión guardada se descarta
Scenario: Servidor inaccesible al arrancar

- WHEN una persona abre la aplicación con una sesión guardada y el servidor no responde
- THEN llega a /login con el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.», la sesión guardada se conserva y, si recarga cuando el servidor vuelve a estar disponible, recupera la sesión
Scenario: El aviso desaparece al volver a entrar

- WHEN una persona que ve el aviso de sesión perdida inicia sesión correctamente
- THEN el aviso deja de mostrarse
Requirement: Cierre de sesión desde la interfaz
La interfaz SHALL permitir cerrar sesión desde el perfil, y SHALL cerrar la sesión local aunque el servidor no confirme el cierre.
Scenario: Cierre de sesión

- WHEN una persona con la sesión iniciada pulsa «Cerrar sesión» en su perfil
- THEN el botón muestra «Cerrando sesión…» y la persona acaba en /login sin sesión
Scenario: Cierre de sesión con el servidor caído

- WHEN una persona pulsa «Cerrar sesión» y el servidor no responde
- THEN la sesión se cierra igualmente en la interfaz, sin mostrar ningún error
Scenario: Volver atrás tras cerrar sesión

- WHEN una persona cierra sesión y pulsa «Atrás» en el navegador
- THEN no vuelve a ver su perfil y acaba en /login
Requirement: Pantalla de perfil
La interfaz SHALL mostrar en /profile las iniciales del usuario, su nombre, su email y la fecha de alta, sin permitir editar ninguno de esos datos.
Scenario: Usuario con nombre

- WHEN una persona con la sesión iniciada abre /profile
- THEN ve un avatar con sus iniciales, su nombre, su email, «Miembro desde» con la fecha de alta en formato largo en castellano (por ejemplo «4 de octubre de 2026») y el botón «Cerrar sesión»
Scenario: Usuario sin nombre

- WHEN una persona registrada sin nombre abre /profile
- THEN en el lugar del nombre ve «Sin nombre»
Requirement: Protección de las pantallas privadas
La interfaz SHALL impedir que se vea el perfil sin una sesión válida.
Scenario: Acceso sin sesión al perfil

- WHEN una persona sin sesión abre /profile
- THEN acaba en /login sin ver ningún dato del perfil
Scenario: Sesión aún validándose

- WHEN una persona abre una pantalla mientras se valida su sesión guardada
- THEN ve un indicador de carga y no se la redirige hasta que termina la validación
Requirement: Pantallas públicas solo sin sesión
La interfaz SHALL llevar al perfil a quien ya tiene sesión e intenta abrir el inicio de sesión o el registro.
Scenario: Usuario con sesión abre el inicio de sesión o el registro

- WHEN una persona con la sesión iniciada abre /login o /register
- THEN acaba en /profile
Requirement: Rutas desconocidas
La interfaz SHALL llevar al perfil cualquier dirección que no sea inicio de sesión, registro o perfil, y SHALL aplicarle la protección habitual.
Scenario: Dirección raíz o desconocida

- WHEN una persona abre / o cualquier dirección no reconocida
- THEN se la lleva a /profile, y de ahí a /login si no tiene sesión


Parte B
1. Requisitos escritos y comprobados

Requisitos escritos: 30

Requisitos comprobados: 2

2. Incoherencias encontradas

Email demasiado largo: la spec afirma que un email de más de 254 caracteres devuelve la regla maxLength, pero en el código la validación .email() se ejecuta antes y rechaza primero los emails que superan 254 caracteres. Por tanto, el error observable es email, no maxLength. backend/app/validators/user.ts.

3. Comportamientos que no sé decidir si son bug o contrato

Tokens sin caducidad: el código permite que los tokens sigan siendo válidos indefinidamente mientras no sean revocados. Puede ser el comportamiento diseñado del sistema o un problema de seguridad por falta de expiración; leyendo únicamente el código no puedo decidir cuál de las dos interpretaciones es la correcta.

Credenciales incorrectas: el login responde 400 tanto cuando el email no existe como cuando la contraseña es incorrecta, mientras que para una API autenticada podría esperarse 401. No puedo decidir solo leyendo el código si el 400 es una decisión deliberada del contrato o un comportamiento incorrecto.

Cierre de sesión: la respuesta correcta del logout no utiliza el mismo envoltorio data que las demás respuestas correctas de la API. Puede ser un formato deliberadamente diferente para este endpoint o una inconsistencia del contrato.