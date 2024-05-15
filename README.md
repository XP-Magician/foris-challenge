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

- ![](https://i.imgur.com/bQy13L9.png)
  [Url imagen](https://i.imgur.com/bQy13L9.png)

- A continuación se detalla de forma general cada directorio y su funcionalidad, para mas adelante en este documento, especificar detalles y funcionamiento asociado :

- 📂**commands**: Este es el directorio por defecto al que se van a buscar los ficheros .txt con comandos solicitados. Por ejemplo si se hace <br>`node app.js misComandos.txt` , el fichero "misComandos.txt"
  será buscado en este directorio. Sin embargo se puede cambiar este comportamiento por defecto. <br>

- 📂**helpers**: Este directorio contiene un script que actúa a bajo nivel en la aplicación para realizar validaciones básicas en los comandos y determinar si son válidos o no. Como se mencionó, actúa con expresiones regulares para hacer estas validaciones. La ventaja de esto es que las expresiones regulares estan centralizadas aquí. Por lo que si se requiere un cambio de estructura en la validación, cualquier cambio aplicará de inmediato a toda la aplicación. A continuación un ejemplo de input, y la respuesta generada en base a esta validación: <br>

- ![](https://i.imgur.com/v4r4hvR.png)
  [Url imagen](https://i.imgur.com/v4r4hvR.png)
  _Si recibieramos un input de este tipo_

- ![](https://i.imgur.com/8sEa8EF.png)
  [Url imagen](https://i.imgur.com/8sEa8EF.png)
  _Todos quedarían descartados gracias a las validaciones y parámetros establecidos en este directorio_

- 📂**entities**: Este directorio contiene entidades que hacen referencia a las propiedades de cada comando, para ser accedidas con mayor facilidad con un objeto descriptivo

- 📂**test**: Como te imaginarás, este directorio contiene todo el testing de cada funcionalidad de la aplicación, contemplando cada caso de uso posible de forma rigurosa.

- 📂**tools**: Este directorio es el núcleo de la aplicación. Contiene diversos scripts utilizados para la lectura de ficheros, manipulación de sus datos, validaciones complejas asociadas, y entrega del resultado final al usuario. Se comunica con los demás scripts que actúan como asistentes en sus labores más complejas.

- 📂**utils**: Este directorio contiene scripts de utilidad como por ejemplo un archivo de configuración, al que se hace referencia en el núcleo de la aplicación _(directorio tools)_, y un diccionario de errores informativos que buscan dar feedback al usuario de sus inputs erróneos para que pueda corregirlos con mayor facilidad.<br><br>

#### Diagrama explicativo de las dependencias entre scripts 🛣️ :

![](https://i.postimg.cc/NFLJD2db/waa.png)
[Url imagen](https://i.postimg.cc/NFLJD2db/waa.png)<br><br>

#### Explicación detallada de los directorios y sus scripts📂📋 :

📂**commands**: Este es el directorio por defecto al que se van a buscar los ficheros .txt con comandos solicitados. Puede contener múltiples ejemplos y/o inputs.

**Es importante** saber que este directorio se puede cambiar como predeterminado, desde el script de configuración del proyecto, del cual se habla en la explicación detallada del directorio _utils_. Un ejemplo de implementación sería algo así :

![](https://i.ibb.co/qF5R5JK/Screenshot-1.png)
[Url imagen](https://i.ibb.co/qF5R5JK/Screenshot-1.png)
_en donde cada .txt puede contener comandos válidos, inválidos, o mixtos. En todos, los casos el sistema es capaz de mantenerse robusto_.
<br>
📂**helpers**: Como se explicó, este directorio contiene expresiones regulares centralizadas en un script, que permiten validar la estructura básica de los comandos. Si conoces o no , de expresiones regulares, te recomiendo en ambos casos visitar [RegExr](https://regexr.com). Es un playground en el que podrás copiar y pegar los detalles de las expresiones regulares usadas en este proyecto y ver que tipo de inputs acepta y cuales no.

En el script **validators.js** contenido aquí, te encontrarás lo siguiente:

```javascript
const VALIDATORS = {
  STUDENT_COMMAND: /^Student [\w]+$/,
  PRESENCE_COMMAND:
    /^Presence [\w]+ [1-7] ((0[8-9])?(1[0-9])?(2[0-3])?:([0-5][0-9]\s)){2}[A-Z]\d{3}$/,
  MIN_DIFF_TIME: 300000,
  MILIS_TO_MINUTES: 60000,
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

**MIN_DIFF_TIME**: Tiempo mínimo de entrada vs salida (en milisegundos) para que una asistencia sea considerada.
**MILIS_TO_MINUTES** : Constante que indica el número a dividir para convertir de milisegundos a minutos.<br>

<br>

**tools📂**: El directorio orquestador de toda la lógica detrás del programa,
a continuación se presentan los scripts contenidos en él, y la función que cumple cada uno de ellos :

- **fileReader.js**: Encargado de leer un fichero con el nombre especificado en la entrada _argv_ de Node, se comunica con el fichero de configuración que contiene el directorio por defecto a donde se van a buscar los ficheros especificados, y también con el diccionario de errores, para proporcionar feedback amigable al usuario, su estructura es la siguiente:

```javascript
// Lectura asíncrona por lo demandante de la tarea
const readFile = async (file_name) => {
  try {
    const file_extension = path.extname(file_name);
    // Se consulta si la extension del fichero está en la lista de permitidos en CONFIG
    if (CONFIG.ALLOWED_EXTENSIONS.includes(file_extension)) {
      // Se lee el archivo según el directorio por defecto con el charset de     CONFIG
      const commands_file = await fs.readFile(
        path.join(CONFIG.COMMANDS_DIRECTORY, file_name),
        CONFIG.CHARSET
      );
      // Se genera un array de comandos no procesados, usando como  separador cada salto de línea
      const raw_array_commands = commands_file.split(CONFIG.NEXT_LINE);
      return raw_array_commands;
    } else {
      // Si la extension no está permitida, se lanza el error EXT_NOT_ALLOWED del diccionario de errores
      throw new Error(ERROR_DICTIONARY.EXT_NOT_ALLOWED);
    }
  } catch (exception) {
    if (exception.message !== ERROR_DICTIONARY.EXT_NOT_ALLOWED)
      // Si el archivo no se encuentra se lanza el error EXT_NOT_ALLOWED   de el diccionario de errores
      throw new Error(ERROR_DICTIONARY.FILE_NOT_FOUND);
    throw exception;
  }
};
```

<br>

- **commandsExtractor.js**: Encargado de formatear el array de comandos en crudo generado por _fileReader.js_, haciendo el primer filtro base de formato, apoyado de _VALIDATORS_ y las regex especificadas con el formato de cada comando, devolviendo una lista de : comandos de tipo Student, comandos de tipo Presence y comandos de tipo Discarded agrupados en un objeto JSON. Su estructura es la siguiente: 
  
  ```javascript
  const getFile = async (filename) => {
  try {
  // Método auxiliar para recuperar un archivo con readFile.js ,entregando el nombre del fichero solicitado y manejando posibles excepciones asociadas.
    if (filename === undefined)
	 // Si el nombre de fichero no se entrega se lanza un error del tipo FILENAME_NOT_PROVIDED del diccionario de errores.
      throw new Error(ERROR_DICTIONARY.FILENAME_NOT_PROVIDED);
    const raw_array_commands = await readFile(filename);
	// Agrega un filtro adicional para eliminar registros vacíos y entregar un array mas limpio al formateador
    const raw_commands_filter = raw_array_commands.filter(
      (raw_command) => raw_command.trim() !== ""
    );
	// Se apoya en formatFile (explicación siguiente) y devuelve su resultado
    const formatted_commands = await formatFile(raw_commands_filter);
    return formatted_commands;
  } catch (exception) {
    throw exception;
  }
	};
	```
<br>

```javascript
// Recibe un formato de array en crudo, con comandos mixtos, invalidos, o validos, y los maneja de acuerdo a las validaciones de las regex, apoyandose en VALIDATORS
const extractCommands = async (raw_commands) => {
  try {
    // Student,Presence y Discarded son los tipos de formato a generar
    let formatted_commands = {
      Student: [],
      Presence: [],
      Discarded: [],
    };
    raw_commands.forEach((raw_command) => {
      let raw_command_trim = raw_command.trimEnd().trimStart();
      switch (true) {
        // Si es un comando del tipo Student y además no está previamente ingresado (manejar duplicidad) sin lanzar excepciones, sino que simplemente ignorando el registro
        case VALIDATORS.STUDENT_COMMAND.test(raw_command_trim):
          if (!formatted_commands.Student.includes(raw_command_trim))
            formatted_commands.Student.push(raw_command_trim);
          break;

        // La misma lógica anterior, si es un comando del tipo Presence
        case VALIDATORS.PRESENCE_COMMAND.test(raw_command_trim):
          if (!formatted_commands.Presence.includes(raw_command_trim))
            formatted_commands.Presence.push(raw_command_trim);
          break;

        // Si no cumple ningun formato anterior, es un comando inválido, se descarta, y se concatena, el comando + un separador definido en el diccionario para visualizar errores + el error del diccionario INVALID_COMMAND_FORMAT
        default:
          formatted_commands.Discarded.push(
            raw_command +
              ERROR_DICTIONARY.INDICATOR_STRING +
              ERROR_DICTIONARY.INVALID_COMMAND_FORMAT
          );
          break;
      }
    });
    // Se retornan los comandos saneados de la primera fase de validacion
    return formatted_commands;
  } catch (exception) {
    throw exception;
  }
};
```

<br>

- **entititesConstructor.js**: Encargado de tomar el primer array con los formatos y comandos saneados, para realizar las validaciones más complejas, asociadas con horas, comparaciones, inexistencia de Students registrados y la relación entre un comando Presence con un Student, para posteriormente generar el logger final de valor para el usuario, su estructura es la siguiente:

```javascript
// Recibe el array saneado con formatFile.js
const presence_validator = async (formatted_array) => {
  try {
    // Se inicializa la relacion que tendrán los estudiantes con presencias
    let students_presence = {};
    let discarded = formatted_array.Discarded;
    // Iteramos sobre cada estudiante creando una clave unica para cada    uno
    formatted_array.Student.forEach((student) => {
      // Eliminamos la palabra Student del comando para solo dejar la clave, puesto que ya sabemos que se trata de Students dada la semántica del array
      let student_id = student.split(" ")[1];
      students_presence[student_id] = [];
    });

    formatted_array.Presence.forEach((presence) => {
      let presence_details_raw = presence.split(" ");
      // La misma operacion con presencias, la palabra Presence no se necesita
      presence_details_raw.shift();
      /* Al hacer split del string tenemos algo como : ['Marco','1','09:02','10:17', 'R100'] de forma segura, ya que previamente se saneó el array de comandos inválidos en cuanto al formato*/
      let presence_details = {
        student_id: presence_details_raw[0],
        day: parseInt(presence_details_raw[1]),
        enter_hour: presence_details_raw[2],
        left_hour: presence_details_raw[3],
        room: presence_details_raw[4],
      };

      // Analiza la presencia apoyandose en VALIDATOR_PRESENCE_DETAILS del directorio helpers, para realizar las validaciones complejas de : hora de entrada siempre mayor a hora de salida, si el estudiante no se registró previamente con Student es descartado, si la presencia fue menor a 5 minutos es descartada.
      const result_validation_presence = VALIDATOR_PRESENCE_DETAILS(
        students_presence,
        presence_details
      );
      if (result_validation_presence === true) {
        students_presence[presence_details.student_id].push(presence_details);
      } else {
        discarded.push(
          presence +
            ERROR_DICTIONARY.INDICATOR_STRING +
            result_validation_presence
        );
      }
    });

    // Finalmente es devuelto un array completamente saneado que contiene una relacion clave-valor entre estudiantes y sus asistencias, y un array informativo con todos los comandos descartados y su explicación.
    return { students_presence, discarded };
  } catch (exception) {
    throw exception;
  }
};
```
<br><br>

**utils📂**: El directorio que contiene las constantes de configuración y diccionario de errores que se ha ido utilizando a lo largo de los orquestadores, su estructura es la siguiente :

- **config.js**

```javascript
const config = {
  COMMANDS_DIRECTORY: path.join("commands"),
  ALLOWED_EXTENSIONS: [".txt"],
  NEXT_LINE: os.EOL,
  CHARSET: "utf8",
};
```

en donde :<br>
`COMMANDS_DIRECTORY` : Especifica el directorio por defecto donde se irán a buscar los ficheros especificados por el usuario, su relatividad parte del directorio raíz del proyecto. <br>
`ALLOWED_EXTENSIONS`: Define las extensiones que se van a permitir al momento de leer un fichero, de momento solo se acepta .txt, pero es extensible a otros formatos si el proyecto crece.<br>
`NEXT_LINE`: Especifica el tipo de salto de línea con el que se deberá separar la lectura del fichero, dependiendo del sistema operativo. <br>
`CHARSET`: Define el charset con el que serán codificados los inputs recibidos. <br><br>

- **errorsDictionary.js**

```javascript
const ERROR_DICTIONARY = {
  EXT_NOT_ALLOWED:
    "The extension of the file is not allowed, you must send an admitted file.",
  FILENAME_NOT_PROVIDED: "You didn't provide the filename to work on.",
  FILE_NOT_FOUND: "The file doesn't exist in the current commands directory.",
  STUDENT_NOT_REGISTERED:
    "The presence must have a registered student with 'Student' command before. ",
  DIFF_NOT_ENOUGH:
    "The presence isn't valid because it's fewer than five minutes.",
  ENTER_GREATHER_THAN_LEFT:
    "The presence isn't valid because the enter time is greather than the left time.",
  INVALID_COMMAND_FORMAT:
    "The command don't have a valid format, check your entries carefully.",
  INDICATOR_STRING: "     -----------> Reason: ",
  DISCARDED_COMMAND_SEPARATOR:
    "\n\n ==================== DISCARDED COMMANDS =======================",
  NO_DISCARDED_COMMANDS: "No discarded commands\n\n ",
  MINUTES_DISPLAY:
    "\n\n ==================== COMMANDS RESULTS =======================",
};
```
<br>

en donde :<br>
`EXT_NOT_ALLOWED` : Informa al usuario que la extensión del archivo solicitado no está permitida. <br>
`FILENAME_NOT_PROVIDED`: Informa al usuario que no proporcionó ningun nombre de fichero a analizar.<br>
`FILE_NOT_FOUND`: Informa al usuario que el archivo solicitado no se encontró en el directorio commands establecido. <br>
`STUDENT_NOT_REGISTERED`: Indica al usuario que intentó ingresar una presencia, sin antes haber registrado al estudiante. <br>
`DIFF_NOT_ENOUGH`: Indica que la presencia fue menor a 5 minutos, por lo que fue ignorada. <br>
`ENTER_GREATER_THAN_LEFT`: Indica que el tiempo de entrada de la presencia es mayor al de salida, por lo que el comando no es valido. <br>
`INVALID_COMMAND_FORMAT`:Indica que el comando no cumple la estructura solicitada en general. <br>
`INDICATOR_STRING`: Cadena de texto que apoya una visualizacion mas amigable de los datos impresos en consola. <br>
`DISCARDED_COMMAND_SEPARATOR`: Título para indicar que los registros siguientes en la consola corresponden a los comandos descartados. <br>
`NO_DISCARDED_COMMANDS`: Texto que indica que no se descartaron comandos en el análisis. <br>
`MINUTES_DISPLAY`: Titulo para indicar que los registros siguientes en la consola corresponden a los registros válidos y procesados. <br><br>

**test📂**: Contiene los tests realizados a cada parte del proyecto, siendo estos un total de 31 tests realizados, separados por categoría, la estructura es la siguiente :

- **files/fileHandler.js📂🔍** :
<br>

  - Contiene tests para validar 4 casos de usos comunes:
    
  - **Test 1**: Verifica si al intentar leer un archivo que no existe en el directorio de comandos, se devuelve una excepción con el error "FILE_NOT_FOUND" del diccionario de 
  errores.
  - **Test 2**: Comprueba que al intentar obtener un archivo con un nombre no proporcionado, se devuelve una excepción con el error "FILENAME_NOT_PROVIDED" del diccionario de errores..
  - **Test 3**: Evalúa si al intentar obtener un archivo con una extensión no permitida, se devuelve una excepción con el error "EXT_NOT_ALLOWED" del diccionario de errores.
  - **Test 4**: Verifica que al intentar leer un archivo que existe en el directorio de comandos, la ejecución continúa sin lanzar excepciones y devuelve un objeto tipo array vacío.

_Resultado final✅ : 4/4 tests pasados._ <br><br>

- **validations/commandsStructure.js🏛️** :
  <br>
  
  - Contiene tests para validar 15 casos de usos asociados al formato de cada comando:
  <br>
  
  **Para el Comando de Estudiante**:
- **Test 1:** Verifica si el sistema reconoce correctamente una estructura de comando inesperada o inválida.
- **Test 2:** Comprueba si el sistema detecta correctamente la ausencia del campo "name_student".
- **Test 3:** Evalúa si el sistema acepta correctamente la estructura esperada del comando.
- **Test 4:** Verifica si el sistema detecta correctamente el exceso de indentación al inicio y al final de la cadena.
- **Test 5:** Comprueba si el sistema detecta correctamente el exceso de indentación entre la palabra clave "Student" y el nombre del estudiante.
- **Test 6:** Evalúa si el sistema detecta correctamente la sensibilidad a mayúsculas y minúsculas en la palabra clave "Student".

<br><br>
 **Para el Comando de Presencia:**
- **Test 1:** Verifica si el sistema reconoce correctamente una estructura de comando inesperada o inválida.
- **Test 2:** Comprueba si el sistema detecta correctamente la ausencia de algún campo requerido, en este caso, el nombre del estudiante.
- **Test 3:** Evalúa si el sistema acepta correctamente la estructura esperada del comando.
- **Test 4:** Verifica si el sistema detecta correctamente un día de la semana inválido.
- **Test 5:** Comprueba si el sistema detecta correctamente un formato de hora no permitido para la hora de entrada.
- **Test 6:** Evalúa si el sistema detecta correctamente un formato de hora no permitido para la hora de salida.
- **Test 7:** Verifica si el sistema detecta correctamente un código de aula no válido.
- **Test 8:** Comprueba si el sistema detecta correctamente el exceso de indentación al inicio y al final de la cadena.
- **Test 9:** Evalúa si el sistema detecta correctamente el exceso de indentación entre la palabra clave "Presence" y los campos.

_Resultado final ✅: 15/15 tests pasados._ <br><br>

- **validations/commandsValues.js 📄** :
<br>
Contiene tests para validar 7 casos de usos complejos asociados a los valores contenidos en cada comando:

- **Test 1:** Verifica la validez de varios formatos especiales del comando 'Student', incluyendo comandos con identación extra en las esquinas..
- **Test 2:** Evalúa cómo el sistema maneja la duplicación de valores en los comandos 'Student' y 'Presence', asegurando que se ignoren los duplicados..
- **Test 3:** Verifica si el sistema descarta correctamente comandos inválidos, incluyendo comandos con estructuras incorrectas y valores incorrectos.
- **Test 4:** Evalúa el comportamiento del sistema cuando se proporcionan tanto comandos válidos como inválidos, asegurando que los comandos válidos sean procesados correctamente y los inválidos sean descartados.
- **Test 5:** Verifica si el sistema devuelve un error adecuado cuando se intenta registrar la presencia de un estudiante que no ha sido registrado previamente.
- **Test 6:** Evalúa si el sistema devuelve un error cuando la diferencia entre la hora de entrada y salida en un comando de presencia es menor a 5 minutos.
- **Test 7:** Verifica si el sistema devuelve un error cuando la hora de entrada es mayor que la hora de salida en un comando de presencia.<br>
_Resultado final✅ : 7/7 tests pasados._ <br><br>

### CHANGELOG 🔃:

#### V1.1📄:
**🚧 En esta version se introdujeron multiples cambios, que deprecaron algunos tests (ya eliminados), y cambiaron la estructura de algunos scripts, para hacerlos mas
modulares. El README aun no refleja por completo estos cambios, por lo que se introducirán paulatinamente, así como los tests asociados a ellos.🚧**

**✍️Semántica en nombrado de ficheros mejorada**: Algunos nombres de ficheros fueron cambiados para proporcionar una descripcion mas semántica de su funcionalidad, por ejemplo en el directorio tools, se cambiaron los siguientes ficheros:

_file_formatter.js_: Pasó a ser _commands_extractor.js_ 
_presence_validator.js_: Pasó a ser _entitiesConstructor.js_
_compileCommands.js_: Pasó a ser _compiler.js_

La finalidad de estos cambios es proporcionar una manera más descriptiva para conocer el propósito detrás de cada fichero, sin necesidad de revisar el código para saber su utilidad principal.

**👨‍🏫Comando Classroom agregado en helpers/validators.js**: En virtud de añadir soporte al requerimiento de un nuevo comando 'Classroom', se añadio una nueva expresion regular que valida esta estructura de commando en los validadores generales. la expresion regular que lo distingue es la siguiente:

```javascript
{CLASSROOM_COMMAND: /^Classroom [A-Z]\d{3} [a-zA-Z0-9]+ (\d{2}\.\d\s?){2}$/}
```
En donde su estructura a cumplimentar es: Palabra Classroom seguido de un codigo de sala en formato LETRA+3numeros, seguido de un nombre y/o numero de sala, seguido de las coordenadas de la sala en cuestion en formato numero.numero numero.numero (ej: 17.5 10.2), recuerda que puedes visitar el playground de [RegExr](https://regexr.com). para testeo y casos de uso.

**📖Nuevos registros en el diccionario utils/errorsDictionary.js**: Se añadieron nuevos registros en el diccionario para representar errores nuevos asociados al comando Classroom, asi como Strings de utilidades para representar datos procesados en la consola, en donde: 

```javascript
{
CLASSROM_DETAILS_NOT_PROVIDED: "Indica que una presencia en una sala de clases especifica no tiene un comando previo Classroom, detallando la sala en cuestión",
ARROW_STRING: "Indicador descriptivo para imprimir datos en consola en el formato Registro->Explicacion",
COMMA_STRING:"Indicador descriptivo para imprimir datos en consola en el formato Registro1,Registro2",
DISCARDED_COMMAND_SEPARATOR: "Titulo descriptivo para indicar comandos descartados",
NO_DISCARDED_COMMANDS: "Titulo descriptivo para indicar que no hubieron comandos descartados",
STUDENTS_GROUP_RESULT: "Titulo descriptivo para indicar que las siguientes entradas imprimidas corresponden a una agrupacion por estudiante",
ROOMS_GROUP_RESULT: "Titulo descriptivo para indicar que las siguientes entradas imprimidas corresponden a una agrupacion por salon de clases,
TRAVELS_GROUP_RESULT: "Titulo descriptivo para indicar que las siguientes entradas imprimidas corresponden a las visitas que tuvo el estudiante a las diversas salas, en orden de dias especificos",
PRESENCES_BY_ROOMNAME: "Titulo descriptivo para indicar que las siguientes entradas imprimidas corresponden a una agrupacion por una sala con un nombre específico",
}
```

**🔃Cambios en la extraccion de comandos y disponibilización de las entidades tratadas (tools/commandsExtractor.js)**: Se introdujo una nueva agrupación y validación de comandos asociada al comando Clasroom, por lo que el resultado de los comandos extraidos en crudo, ahora retorna tambien un array de comandos del tipo "Clasroom", a continuacion puedes observar donde se encuentra:

```javascript
export const commandsExtractor = async (raw_commands) => {
  try {
    let extracted_commands = {
      Student: [],
      Presence: [],
      Classroom: [], // Soporte para el comando classroom
      Discarded: [],
    };
    raw_commands.forEach((raw_command) => {
      let raw_command_trim = raw_command.trimEnd().trimStart();
      switch (true) {
        // Es un comando tipo Student
        case VALIDATORS.STUDENT_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Student.includes(raw_command_trim))
            extracted_commands.Student.push(raw_command_trim);
          break;

        // Es un comando tipo Presence
        case VALIDATORS.PRESENCE_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Presence.includes(raw_command_trim))
            extracted_commands.Presence.push(raw_command_trim);
          break;

        // Es un comando tipo Classroom
        case VALIDATORS.CLASSROOM_COMMAND.test(raw_command_trim):
          if (!extracted_commands.Classroom.includes(raw_command_trim))
            extracted_commands.Classroom.push(raw_command_trim);
          break;

        // Es un input invalido que pasa a descarte
        default:
          extracted_commands.Discarded.push(
            new Discarded(raw_command, ERROR_DICTIONARY.INVALID_COMMAND_FORMAT)
          );
          break;
      }
    });
    // El retorno de comandos finales incluye un array de comandos Classroom
    return extracted_commands;
  } catch (exception) {
    throw exception;
  }
};
```

**📂Creacion del directorio Entities:** En esta version se introdujo un nuevo directorio "Entities" en el proyecto, este directorio, cumple la funcion de agrupar las propiedades de cada uno de los comandos en clases y objetos, por lo que ahora, las responsabilidades para validar casos de uso específicos, recaen directamente sobre la clase y el tipo de entidad en cuestión, a continuación se presenta un ejemplo con la entidad de "Presences":

```js
// Imports y dependencias propias de la Entidad
import { DateTime } from "luxon";
import ERROR_DICTIONARY from "../utils/errorsDictionary.js";
import { VALIDATORS } from "../helpers/validators.js";

// Construccion de un objeto con atributos propios de una Presencia
export class Presence {
  constructor(room, student_id, enter_hour, left_hour, day) {
    this.room = room;
    this.student_id = student_id;
    this.enter_hour = enter_hour;
    this.left_hour = left_hour;
    this.day = day;
    this.minutes = this.calculateMinutes(enter_hour, left_hour);
  }

// Ahora, el calculo de minutos totales de presencia es responsabilidad única de esta entidad, haciendo mas reusable los extractores de comandos, y el compilador final
  calculateMinutes(enter_hour_raw, left_hour_raw) {
    const enter_hour = DateTime.fromISO(enter_hour_raw);
    const left_hour = DateTime.fromISO(left_hour_raw);
    const minutes_presence =
      (left_hour.toMillis() - enter_hour.toMillis()) /
      VALIDATORS.MILIS_TO_MINUTES;
    return minutes_presence;
  }

  getPresence() {
    return {
      room: this.room,
      minutes: this.minutes,
      student_id: this.student_id,
      enter_hour: this.enter_hour,
      left_hour: this.left_hour,
      day: this.day,
    };
  }

// El mismo caso aplica para la validacion propia de la presencia, una vez se construye el objeto, este metodo es llamado para verificar el cumplimiento de las restricciones //asociadas
  isValidPresence(list_students, list_classrooms) {
    const presence_to_verify = this.getPresence();
    let student_was_registered = false;
    let classroom_was_registered = false;
    list_students.forEach((student_object) => {
      // Student was previously registered?
      if (student_object.student_id === presence_to_verify.student_id) {
        student_was_registered = true;
        return;
      }
    });
    list_classrooms.forEach((classroom_object) => {
      if (classroom_object.room_code === presence_to_verify.room) {
        classroom_was_registered = true;
        return;
      }
    });
    let { enter_hour, left_hour } = presence_to_verify;
    enter_hour = DateTime.fromISO(enter_hour);
    left_hour = DateTime.fromISO(left_hour);
    // La hora de entrada no debe ser mayor a la de salida
    if (left_hour < enter_hour)
      return ERROR_DICTIONARY.ENTER_GREATHER_THAN_LEFT;

    // Presencia de al menos 5 minutos
    if (left_hour.toMillis() - enter_hour.toMillis() < VALIDATORS.MIN_DIFF_TIME)
      return ERROR_DICTIONARY.DIFF_NOT_ENOUGH;

    // El classroom y el estudiante de la presencia, deben estar registrados previamente
    return student_was_registered
      ? classroom_was_registered
        ? true
        : ERROR_DICTIONARY.CLASSROM_DETAILS_NOT_PROVIDED
      : ERROR_DICTIONARY.STUDENT_NOT_REGISTERED;
  }
}


```
_Como se menciona, las validaciones propias del comando específico, pasan ahora a ser responsabilidad de la clase misma, por lo que helpers/validators.js, unicamente contempla ahora, validaciones generales asociadas a la estructura de los comandos_

**🆕Nuevo fichero en tools ->groupers.js** : Este fichero permite generar un enfoque mas flexible en toda la aplicacion. Su objetivo es permitir la introduccion de nuevas formas de agrupamiento, filtrado, y tratamiento de los datos extraidos de los comandos en general, de forma aislada. de tal manera que no dañe el funcionamiento de los demas tipos de agrupaciones, al momento de introducir nuevas cláusulas. Un ejemplo de agrupamiento, por estudiantes:

```javascript
// Unico agrupamiento que recopila datos por separado de el constructor de entidades
export const groupByStudent = async () => {
  const { students, presences, discarded } = await entitites_constructed();
  // Algoritmo propio de agrupacion, por estudiante
  const student_presences = {};
  students.forEach((student_entity) => {
    if (student_presences[student_entity.student_id] === undefined)
      student_presences[student_entity.student_id] = [];
  });

  presences.forEach((presence_entity) => {
    student_presences[presence_entity.student_id].push(presence_entity);
  });

  // Una vez tratados los datos, se retornan para ser tratados por el compilador
  return { student_presences, discarded };
};
```
_de la misma forma anterior, se pueden generar cuantas agrupaciones nuevas sean necesarias, en diferentes modulos de este fichero, lo que permite una mayor flexibilidad y como consecuencia menor acoplamiento y dependencia entre modulos_

**🔃Cambios en el compilador tools ->compiler.js** : Se introdujeron cambios en la manera en que se procesan los datos finales, al existir ahora un agrupamiento en base a necesidades especificas de procesamiento, tales como agrupacion por estudiantes, salas, viajes, etc. El compilador por su parte, ahora trabaja de forma individual y aislada tambien, para cada una de estas agrupaciones. Separando la logica y evitando rupturas del código y funcionalidades existentes a largo plazo, a continuacion te presento un ejemplo del compilador, para agrupaciones en base a los estudiantes:

```javascript
export const getStudentGroupResult = async () => {
// Los datos de la agrupacion especifica son devuelvos por groupers.js
  let { student_presences, discarded } = await groupByStudent();
  // El sorteo de datos en orden descendente, pasa a ser una funcion reutilizable del compilador, independiente del tipo de agrupacion
  const individual_student_presences = sortListByMinutes(student_presences);
  const processed_presences = []; 
  // El calculo de minutos asistidos por estudiante pasa a ser una funcion reutilizable del compilador, independiente del tipo de agrupacion
  individual_student_presences.forEach((student) => {
    const student_all_presences = student_presences[student];
    processed_presences.push(
      genericStudentResult(student_all_presences, student)
    );
  });
  return { processed_presences, discarded };
};
```
_como puedes observar, ahora el agrupamiento de datos en base a un criterio especifico, es una tarea delegada a groupers.js, por lo que tambien se reduce la complejidad del compilador, quien a su vez, se apoya de funciones independientes y reusables para el sorteo y calculo de minutos totales de asistencia asociados a un estudiante_

**🆕Funcionalidades de utilidad nuevas en el compilador tools ->compiler.js** : Se añadieron funciones de utilidad reusables para el compilador, estas incluyen el calculo de minutos totales de presencia de cada estudiante, y el sorteo descendente de los registros en base a la cantidad de minutos de la presencia. Los cuales funcionan en base a una lista de estudiantes que se provee por parametros, y de forma independiente de la clausula de agrupamiento desde la que se llamaron. A continuacion las funciones: 

```javascript
const genericStudentResult = (student_presences, student_id) => {
  let total_minutes = 0;
  let different_days = [];
  let processed_presence_string = `${student_id} : `;
  if (student_presences.length === 0) {
    // Si la presencia total es igual a cero
    processed_presence_string += `0 minutes`;
    return processed_presence_string;
  } else {
    // Si es mas de cero se calcula la suma total de minutos
    student_presences.forEach((presence) => {
      total_minutes += presence.minutes;
      different_days.includes(presence.day)
        ? different_days
        : different_days.push(presence.day);
    });
    // Se construye un string descriptivo final que sera imprimido en la consola
    processed_presence_string += `${total_minutes} minutes in ${different_days.length} `;
    processed_presence_string += different_days.length == 1 ? "day" : "days";
    return processed_presence_string;
  }
};
```
```javascript
const sortListByMinutes = (student_presences) => {
  // Se retorna cada presencia del estudiante sorteada por la cantidad de minutos de presencia en orden descendente
  return Object.keys(student_presences).sort((st1, st2) => {
    const st1_array = student_presences[st1];
    const st2_array = student_presences[st2];
    const minutes_acc_1 = st1_array.reduce((minutes,presence)=>(minutes+presence.minutes),0);
    const minutes_acc_2 = st2_array.reduce((minutes,presence)=>(minutes+presence.minutes),0);
    return minutes_acc_2 - minutes_acc_1;
  });
};

```
**🆕Nuevo script utils/logger.js** : Este script es sencillo pero muy util, se apoya en la dependencia _kleur_, la cual fue agregada en esta version. Es capaz de imprimir datos en consola con diferentes estilos, lo que permite agrupar los datos de una forma visual mas facil de identificar para el usuario. Su implementacion:

```javascript
import kleur from "kleur";

// Estilos definidos por parametros
const styles = {
  WARN_TITLE: kleur.bold().bgYellow().underline,
  INFO_TITLE: kleur.bold().bgGreen().underline,
  INDICATOR: kleur.bold().yellow,
  TEXT: kleur.white,
};

// Utilidad print, que imprime un titulo y/o texto entregado por parametros, con uno de los estilos solicitados que se encuentran en styles{...}
const print = (title, style) => {
  const writter = styles[style];
  console.log(writter(title));
};

// Se exporta la utilidad print para ser utilizada en app.js
export default print;

```


**🆕Funcionalidades de utilidad nuevas en el punto de entrada (app.js)** : Todas las utilidades y funciones referentes a imprimir en la consola las presencias procesadas de acuerdo a las diferentes clausulas de agrupacion, se encuetran ahora en app.js, la cual se apoya en logger.js, con la finalidad de imprimir los datos obtenidos y titulos declarados en _utils/errorDictionary.js_ de una forma mas amigable para el usuario. Ejemplo de implementacion: 

```javascript
/************ UTILS *************/
const print_processed = (processed, title) => {
  // El logger procesa los estilos e imprime de acuerdo a lo especificado
  print(title, "INFO_TITLE");
  processed.length === 0
    ? print("NO RESULTS", "INDICATOR")
    : processed.forEach((stp) => print(`${stp}`, "TEXT"));
};

```
```javascript
// El metodo inicializar contiene todos los tipos de agrupaciones diferentes imprimidos en consola, asi como la impresion de los comandos descartados al final
const initialize = async () => {
  await print_presences_by_room();
  await print_travels_student();
  await print_filtered_roomname("LAB4");
  await print_presences_by_student();
  await print_discarded();
};
```
![](https://i.imgur.com/s0tpsIL.png)
[Url imagen](https://i.imgur.com/s0tpsIL.png)
_los datos son presentados con mayor orden_

### Levantando el proyecto 👩‍🚀🚀

Asegúrate de tener Node.js instalado en tu sistema. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

1. Clona este repositorio o descarga el archivo ZIP.
2. Abre una terminal y navega hasta la carpeta del proyecto.
3. Ejecuta el siguiente comando para instalar las dependencias: <br>
   `npm install`

### Dependencias 📚⚙️

[Chai](https://www.chaijs.com/): Biblioteca de aserciones para Node.js y navegadores.<br>
[Mocha](https://mochajs.org/):Framework de pruebas para Node.js.<br>
[Luxon](https://moment.github.io/luxon/#/?id=luxon): Biblioteca moderna de manipulación de fechas y horas para JavaScript.<br>
[Kleur](https://www.npmjs.com/package/kleur): Biblioteca basada en el rendimiento para poder imprimir colores en la consola de Node.<br>

### Ejecución y scripts asociados: 🏃‍♂️🏃

- `node app.js tuFichero.txt`: Este comando iniciará el procesamiento del archivo que le indiques para finalmente imprimirlo por consola. Recuerda que el directorio por defecto está definido en _utils/config.js_<br><br>
- `npm run test`: Este comando ejecutará todos los test asociados a todos los módulos del sistema.<br><br>
- `npm run test_commands`: Este comando ejecutará todos los test asociados únicamente a el formato básico a cumplimentar de los comandos.<br><br>
- `npm run test_commands_values`: Este comando ejecutará todos los test asociados únicamente a los valores a cumplimentar de los comandos y que estos sean íntegros.<br><br>
- ` npm run test_file_handler`: Este comando ejecutará todos los test asociados únicamente a el manejo de ficheros.<br><br>

### 🙋 Candidato

- 🌟 Diego Fábrega Elizalde
- 📞 (9)90622898
- `<Mi web>` : <https://www.dafe.pro>
- 📩 contacto@dafe.pro / dafepro2024@gmail.com
- 📌 https://github.com/XP-Magician
