## Propuesta de solución - Desafío Foris 🤖

### Contexto del desafío y el repositorio 💭

- Se debe realizar un mini-proyecto capaz de procesar un input de entrada,
  proporcionado por parámetros estándar ó contenidos en el código fuente mismo.

- Cada línea del archivo de entrada empieza con un comando. De los cuales hay dos comandos posibles.

- El **primero** es `Student`, que registra un nuevo estudiante en la aplicación.
  **_Ejemplo_ :**

```
Student Matthias
```

- El **segundo** comando es `Presence`, que registra la presencia de un estudiante en la universidad. Esta línea tiene los siguientes datos separados por espacios:

1. el comando (`Presence`)
2. el nombre del estudiante
3. el día de la semana
4. la hora inicial de detección
5. la hora final de detección
6. el código de la sala en la que se realizó la detección

**_Ejemplo_ :**

```
Presence Matthias 2 09:04 10:35 F100
```

Esto indica que Matthias estuvo en la sala F100 el día martes desde las 9:04 hasta las 10:35.

**_Observaciones requeridas_** :

- Los días de la semana van de 1 a 7
- Los tiempos se entregan en formato HH:MM, usando un reloj de 24 horas.
- También se asume que ningún estudiante se queda en la universidad después de media noche (es decir, la hora de inicio siempre será anterior a la hora de fin).

### Objetivo del desafío 🌟

- Generar un reporte que liste cada estudiante con el total de minutos registrados y la cantidad de días que asistió a la universidad. Ordenar este resultado por la cantidad de minutos de mayor a menor.

- Descartar cualquier registro que indique presencias menores a 5 minutos.

**_Ejemplo de entrada_** :

```
Student Marco
Student David
Student Fran
Presence Marco 1 09:02 10:17 R100
Presence Marco 3 10:58 12:05 R205
Presence David 5 14:02 15:46 F505
```

**_Ejemplo de salida_** :

```
Marco: 142 minutes in 2 days
David: 104 minutes in 1 day
Fran: 0 minutes
```

### Observaciones generales 👀

- Aunque a primera vista el desafío planteado se puede imaginar como una solución sencilla a nivel técnico (leer un fichero, formatear los datos, operar sobre ellos). En realidad hay **cierta complejidad que no aparece a simple vista**, y algunos desafíos que surgirán a lo largo de la implementación.

- En base a lo anterior, algunas observaciones generales son:

  - El objetivo y desafío a completar es para un caso de uso muy específico, por lo que **el código tenderá a ser muy imperativo**, y si no se maneja bien, ocasionará problemas de legibilidad para los demás miembros del equipo. <br/><br/>

- Tomando en cuenta el producto de Foris y el rubro de los clientes que lo utilizan (educación), se debe hacer un análisis exhaustivo que permita implementar restricciones adicionales a las solicitadas si es necesario, para **mantener la integridad de los registros ingresados**. Algo que es crucial en instituciones educacionales, sobre todo cuando se trata de asistencia y evaluaciones. <br/><br/>

- Tomando en cuenta también que Foris maneja una gran cantidad de tráfico, cualquier proyecto asociado a Foris, independiente de su tamaño, **debe garantizar un comportamiento predecible ante datos mal ingresados**, inputs inválidos, y registros que no cumplan las validaciones, por lo que es crucial que el sistema sea **robusto y asegure su funcionamiento continuo, contemplando todos los casos de uso posibles mediante el testing**.<br/><br/>

### Paradigma de programación seleccionado 👨‍🏫

- Para este caso de uso se decidió hacer uso de un **paradigma funcional** por sobre uno orientado a objetos.

- La razón detrás de esto es que a lo largo de la implementación técnica, se deberán ir realizando una serie de validaciones para poder continuar a las siguientes etapas de la transformación de texto plano al comando deseado real.
  - En base a esto, se requieren funciones de orden superior que se comuniquen entre sí y garanticen el mismo resultado dado un mismo conjunto de entradas, en este caso, un input de texto con una estructura de comandos relativamente predecible.<br/><br/>
  - Sumado a lo anterior, esta problemática no incluye ningún tipo de entidad compleja a ser representada, sino mas bien evaluaciones sobre un conjunto de datos, para entregar siempre el mismo resultado. Por lo que abordar esta problemática usando orientación a objetos, añadiría boilerplate adicional al proyecto, con clases que serían unicamente instanciadas para llamar a sus métodos, sin hacer uso de los atributos ni herencia, dado que la manipulación de los datos es diferente en cada función a realizar.<br/><br/>
  - Finalmente, usar el paradigma funcional aportaría una mejor legibilidad, pudiendo categorizar cada función asociada a la secuencia de transformación, con nombres semánticos y representativos, sin necesidad de instanciar ni crear anidamientos adicionales como en la orientación a objetos. (Clases **->** Métodos **->** Instancia **->**Uso ) **VS** (Declaración **->** Uso) del paradigma funcional. <br/><br/>

### Restricciones adicionales implementadas 🚧

- Sumado a las restricciones solicitadas, se añadieron más restricciones asociadas a los comandos en general, a continuación, tienes una lista de ellas, con el motivo de fondo :<br/><br/>

  - **Comando `Presence` campo `Codigo de sala`**: <br/>

    - Todas las instituciones educativas de nivel superior poseen una nomenclatura específica para codificar cada una de las salas del establecimiento, basada en diferentes criterios como el número de piso o área en que se encuentren ,etc. Pero siempre esta nomenclatura tiene un sentido y estructura claramente definida, con el fin de facilitar a los estudiantes y al personal su búsqueda.

  - En base a lo anterior, es de suma importancia validar que esta estructura definida por el establecimiento educacional se cumpla.

  - Además, los outputs finales e interpretados de los comandos por el programa, podrían ser registrados más adelante en una base de datos, por lo que es importante mantener la integridad para evitar posibles errores relacionados con referencias inválidas. <br/><br/>

- **Restricciones generales asociadas a los `comandos `** :<br/><br/>
  - Se debe tomar acción sobre los registros duplicados en caso de existir, ya sea con `Student` o `Presences`<br><br>
    - La integridad en el contexto de uso de este proyecto es de suma importancia, un registro duplicado puede ocasionar graves problemas a nivel operativo de la institución educacional. Sobre todo con registros relacionados a asistencia. Los cuales están directamente ligados a si un estudiante aprueba o reprueba una asignatura.<br></br><br>
  - Se debe tomar acción sobre los registros `Presences` que impliquen a un estudiante no registrado previamente con `Student`<br><br>
    - El comando `Student` tiene una razón de ser, y es que cada asistencia debe ser asociada a un estudiante previamente registrado, por lo que sin este registro, el comando `Presence` entregaría información de nula utilidad para la institución e incluso ocasionar errores en la generación de informes asociados a estudiantes.<br></br>
- Se debe tomar acción sobre los registros `Presences` que impliquen un horario de entrada y/o salida menor a 08:00 y un horario desde media noche hasta la hora indicada.<br></br>
  - Esto debido a la restricción planteada de que ningun estudiante se queda hasta despues de medianoche, por lo tanto los horarios de entrada de 00:00 a 05:00 deberían quedar descartados. Sin embargo el horario de entrada mínimo general para los estudiantes son las 08:00, por lo que 06:00 a 07:00 también se descartan.<br><br>

### Modelamiento técnico del problema ⚙️ <br>

#### Datos generales 📕:

- Lenguaje de programación utilizado: **JavaScript (NodeJS)**<br><br>
  - Este lenguaje de programación, con _ECMAScript 6_ facilita una forma explícita y estructurada para organizar un sistema en módulos. Lo que facilita la legibilidad y mantenibilidad del código. Un ejemplo real de implementación en el proyecto :

```javascript
import path from "node:path";
import os from "node:os";
// Fichero de configuración global fácilmente modificable
const config = {
  COMMANDS_DIRECTORY: path.join("commands"),
  ALLOWED_EXTENSIONS: [".txt"],
  NEXT_LINE: os.EOL,
  CHARSET: "utf8",
};

export default config;
```

```js
// Uso del módulo de configuración global
import CONFIG from "../utils/config.js";
const readFile = async (file_name) => {
   		 const file_extension = path.extname(file_name);
		 //Referencia de extensiones permitidas
    		if (CONFIG.ALLOWED_EXTENSIONS.includes(file_extension)) {
    			  const commands_file = await fs.readFile(
       			 path.join(CONFIG.COMMANDS_DIRECTORY, file_name),
        			CONFIG.CHARSET); // Referencia del charset utilizado
      		const raw_array_commands = commands_file.split(CONFIG.NEXT_LINE); // Referencia del tipo de salto de carro segun S.O
      		return raw_array_commands; }
```

_nota: más adelante en este documento se detallan todos los scripts._
<br><br> - Sumado a esto, este proyecto involucra operaciones de alta carga, en específico, la lectura de un fichero externo. JavaScript facilita las operaciones asíncronas en un formato mucho las legible con **async/await**. <br><br> - Como acto de honestidad, JavaScript es un lenguaje con el que he estado programando últimamente y siento que puedo demostrar en mayor medida mis habilidades de programación con él, sin embargo, esto no quita validez a los argumentos anteriores.
<br>

- Base de algoritmos y validaciones : 🖋️**Expresiones regulares (Regex)**<br><br>
  - La razón detrás de la selección de este enfoque, es la naturaleza del proyecto. Se recibe un input de texto plano que debe ser manipulado y procesado, tanto con validaciones, como para entregar un output final en base a este. Por lo tanto las expresiones regulares son la forma más fácil y óptima de manejar este comportamiento de manipulación y validaciones complejas sobre el texto.<br><br>
- Lo anterior tiene una serie de ventajas por sobre utilizar el propio paradigma funcional para validar las cadenas de texto, una de las más importantes es que fomenta la reutilización de la expresión regular, siendo esta fácil de mantener y cambiar al largo plazo. Además su implementación en el código es simple y requiere ** una única línea para implementar y validar**, a diferencia de si se utilizaran métodos para manipular cadenas como<br> `.match( )  .trim ( ) ` u otros. Si bien estos métodos son útiles y de hecho, en este proyecto se utilizan. Su uso desmedido puede causar anidamiento excesivo y dificultar la legibilidad del código para los miembros del equipo.<br><br>
- Sin embargo existe también una desventaja asociada al uso de Regex como la base de los algoritmos de un proyecto, y esta es, que lo más probable es que no todos los miembros del equipo conozcan de expresiones regulares. Este problema se aborda más adelante en este documento, con una explicación detallada de cada regex utilizada y un playground para que se puedan testear y revisar casos de uso.<br><br>

- Estructuras de datos utilizadas :📚 { } **Arrays y JSON**<br><br>
- Se seleccionaron **Arrays** como estructura de datos, debido a que, al tratarse de comandos de diferente propósito, en la primera extracción se pueden separar en diferentes arrays para ser identificados mas facilmente. Sumado a esto , además de un array de `[Presences] , [Students]`. También puede existir un array de `[Discarded]` con todos los comandos descartados, seguidos de un motivo explicativo de su descarte.<br><br>
- Sumado a lo anterior, se requiere ordenar de una forma específica los registros extraídos de acuerdo con la cantidad de minutos registrados de presencia de mayor a menor. El tipo de dato array posee diferentes metodos como `.filter ( ) o .sort ( )` que pueden apoyar estas tareas de forma fácilmente legible para los miembros del equipo.<br><br>
- Por otra parte **JSON** además de ser un estándar en JavaScript, permite la asociación de datos de forma fácil gracias a su enfoque _clave-valor_. Por lo que esto permitirá asociar cada estudiante, con sus respectivos registros de presencia, sean cero o más.<br><br>
- Adicionalmente, se requieren realizar manipulaciones de cierta complejidad con datos asociados con los estudiantes, como conversión de horas de formato digital _HH:MM_ a minutos, días diferentes de la semana que asistió, o asociación de un mismo día que no debería ser contado como diferente. Todo lo anterior también es facilitado por el formato **JSON**, ya que permite almacenar diferentes tipos de datos y mutarlos, tal como se haría con una clase en _POO_, pero de forma mucho más resumida y práctica, lo que es ideal para este caso de uso.<br><br>

<br><br>

#### Estructura del proyecto 📁:

- Al clonar el proyecto te encontrarás con la siguiente estructura en los directorios :

- ![](https://i.imgur.com/vdlTSzC.png)
  [Url imagen](https://i.imgur.com/vdlTSzC.png)

- A continuación se detalla de forma general cada directorio y su funcionalidad, para mas adelante en este documento, especificar detalles y funcionamiento asociado :

- 📂** commands **: Este es el directorio por defecto al que se van a buscar los ficheros .txt con comandos solicitados. Por ejemplo si se hace <br>`node app.js misComandos.txt` , el fichero "misComandos.txt"
  será buscado en este directorio. Sin embargo se puede cambiar este comportamiento por defecto. <br>

- 📂** helpers **: Este directorio contiene un script que actúa a bajo nivel en la aplicación para realizar validaciones básicas en los comandos y determinar si son válidos o no. Como se mencionó, actúa con expresiones regulares para hacer estas validaciones. La ventaja de esto es que las expresiones regulares estan centralizadas aquí. Por lo que si se requiere un cambio de estructura en la validación, cualquier cambio aplicará de inmediato a toda la aplicación. A continuación un ejemplo de input, y la respuesta generada en base a esta validación: <br>

- ![](https://i.imgur.com/v4r4hvR.png)
  [Url imagen](https://i.imgur.com/v4r4hvR.png)
  _Si recibieramos un input de este tipo_

- ![](https://i.imgur.com/8sEa8EF.png)
  [Url imagen](https://i.imgur.com/8sEa8EF.png)
  _Todos quedarían descartados gracias a las validaciones y parámetros establecidos en este directorio_

- 📂** test **: Como te imaginarás, este directorio contiene todo el testing de cada funcionalidad de la aplicación, contemplando cada caso de uso posible de forma rigurosa.

- 📂** tools **: Este directorio es el núcleo de la aplicación. Contiene diversos scripts utilizados para la lectura de ficheros, manipulación de sus datos, validaciones complejas asociadas, y entrega del resultado final al usuario. Se comunica con los demás scripts que actúan como asistentes en sus labores más complejas.

- 📂** utils **: Este directorio contiene scripts de utilidad como por ejemplo un archivo de configuración, al que se hace referencia en el núcleo de la aplicación _(directorio tools)_, y un diccionario de errores informativos que buscan dar feedback al usuario de sus inputs erróneos para que pueda corregirlos con mayor facilidad.<br><br>

#### Diagrama explicativo de las dependencias entre scripts 🛣️ :

![](https://i.postimg.cc/NFLJD2db/waa.png)
[Url imagen](https://i.postimg.cc/NFLJD2db/waa.png)<br><br>

#### Explicación detallada de los directorios y sus scripts📂📋 :

📂** commands **: Este es el directorio por defecto al que se van a buscar los ficheros .txt con comandos solicitados. Puede contener múltiples ejemplos y/o inputs.

**Es importante ** saber que este directorio se puede cambiar como predeterminado, desde el script de configuración del proyecto, del cual se habla en la explicación detallada del directorio _utils_. Un ejemplo de implementación sería algo así :

![](https://i.ibb.co/qF5R5JK/Screenshot-1.png)
[Url imagen](https://i.ibb.co/qF5R5JK/Screenshot-1.png)
_en donde cada .txt puede contener comandos válidos, inválidos, o mixtos. En todos, los casos el sistema es capaz de mantenerse robusto_.
<br>
📂** helpers **: Como se explicó, este directorio contiene expresiones regulares centralizadas en un script, que permiten validar la estructura básica de los comandos. Si conoces o no , de expresiones regulares, te recomiendo en ambos casos visitar [RegExr](https://regexr.com). Es un playground en el que podrás copiar y pegar los detalles de las expresiones regulares usadas en este proyecto y ver que tipo de inputs acepta y cuales no.

En el script **validators.js** contenido aquí, te encontrarás lo siguiente:

```javascript
const VALIDATORS = {
  STUDENT_COMMAND: /^Student [\w]+$/,
  PRESENCE_COMMAND:
    /^Presence [\w]+ [1-7] ((0[8-9])?(1[0-9])?(2[0-3])?:([0-5][0-9]\s)){2}[A-Z]\d{3}$/,
  MIN_DIFF_TIME: 300000,
  MILIS_TO_MINUTES: 60000,
  EXTRACT_MINUTES_FROM_STR: /\d+\sminutes/,
};
```

Puedes observar que el JSON llamado VALIDATORS contiene todas las expresiones regulares y constantes requeridas para validar cada comando ingresado. A continuación te explico cada una de ellas:

**STUDENT_COMMAND** : Hace un match para cadenas de texto que contengan la palabra _Student_ al principio, seguido de un _espacio_ , seguido de _cualquier palabra o letra_ y _nada más al final_, ejemplos:<br>
` Student diego` : Hace match <br>
` Student diego abc` : No hace match por la entrada extra 'abc'<br>
` student diego` : No hace match porque Student es sensitive case<br>
` Student **?¿¡` : No hace match porque el nombre del Student no son letras. <br>

Como te dije, puedes ir jugando y probando estas combinaciones en el playground de [RegExr](https://regexr.com).<br><br>

**PRESENCE_COMMAND**: Hace match para cadenas de texto que contegan : Presence seguido de un espacio , seguido de una palabra (id del estudiante), seguido de un número en el rango de 1 a 7 (días de la semana), seguido de un formato de hora desde 08:00 hasta 23:59 y un código de sala con nomenclatura LETRA_MAYUSCULA+ 3 números (excluyente). La nomenclatura está basada en los ejemplos entregados. Algunos ejemplos:

`Presence Marco 1 09:02 10:17 R100` : Hace match <br>
`Presence Marco 8 09:02 10:17 R100` : No hace match porque el día 8 de la semana no existe<br>
`Presence Marco 7 00:06 10:17 R100` : No hace match porque la hora de entrada no está permitida.<br>
`Presence Marco 7 59:59 10:17 R100` : No hace match porque la hora de entrada no es válida.<br>
`Presence Marco 7 08:06 10:17 100CJK` : No hace match porque el código de sala no sigue la nomenclatura.<br>

** MIN_DIFF_TIME **: Tiempo mínimo de entrada vs salida (en milisegundos) para que una asistencia sea considerada.

**MILIS_TO_MINUTES** : Constante que indica el número a dividir para convertir de milisegundos a minutos.<br>
**EXTRACT_MINUTES_FROM_STR**: Extraer minutos de un log ya procesado, para convertirlos y trabajar con ellos. Por ejemplo:

`Marco: 142 minutes in 2 days` : De esta entrada procesada solo obtendría : 142 minutes , con la finalidad de hacer el sorteo final del array en formato descendente.

**VALIDATOR_PRESENCE_DETAILS ( )** : Realiza validaciones complejas una vez las validaciones base ya se realizaron con las regex, por ejemplo :

```javascript
const VALIDATOR_PRESENCE_DETAILS = (
  students_list, // Lista de estudiantes procesada
  presence_to_verify // Comando presencia con estructura válida
) => {
  if (students_list[presence_to_verify.student_id] === undefined)
    // No válido si se registra una presencia sin un Student previo
    return ERROR_DICTIONARY.STUDENT_NOT_REGISTERED;
  let { enter_hour, left_hour } = presence_to_verify;
  enter_hour = DateTime.fromISO(enter_hour);
  left_hour = DateTime.fromISO(left_hour);
  // No válido si la hora de entrada es mayor a la de salida
  if (left_hour < enter_hour) return;
  ERROR_DICTIONARY.ENTER_GREATHER_THAN_LEFT;
  if (left_hour.toMillis() - enter_hour.toMillis() < VALIDATORS.MIN_DIFF_TIME)
    // No válido si la presencia es menor al tiempo mínimo indicado
    return ERROR_DICTIONARY.DIFF_NOT_ENOUGH;
  return true;
};
```
