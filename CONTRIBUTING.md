# Cómo Contribuir

Esta miniguía va a consistir en como desarrollar en este proyecto. Contiene una lista de buenas prácticas para situaciones comunes.

## Contenido

1. [Arquitectura](#Arquitectura)
    1. [Controlador](#Controlador)
    2. [Servicio](#Servicio)
    3. [Repositorios](#Repositorios)
3. [Herramientas](#Herramientas)
3. [Pruebas](#Pruebas)
4. [Contribuir](#Contribuir)
5. [Reusabilidad](#Reusabilidad)
6. [Despliegue](#Despliegue)

## Arquitectura

La arquitectura de nuestro back-end es muy similar a una aplicación MVC genérica.

### Controlador

Se encarga de las siguientes tareas:

- Validación de datos
- Pase de parámetros del servicio

NO debe contener lógica de nuestra aplicación. El controlador bajo el framework express sería las [rutas](https://expressjs.com/en/guide/routing.html)

### Servicio

Se encarga de manipular los datos y/o comunicarse con bases de datos o terceros. Puede realizar validaciones que requieren comunicación con los anteriores.

Pueden desarrollarse en funciones/clases.

### Repositorios

Contienen la abstracción a la manipulación de datos (persistentes o no). La idea es que si queremos realizar una query para crear un objeto, exportemos un método y se llame en los servicios, no colocar la query directamente en el mismo.

## Herramientas

Las herramientas a usar serán:

- [Express](https://expressjs.com/): Framework minimalista que permite crear rest APIs de manera sencilla e intuitiva.
- [Jest](https://jestjs.io/): Framework de pruebas unitarias para javascript.
- [Typescript](https://typescriptlang.org/docs/home.html): Superset de Javascript que otorga tipado al lenguaje, ideal para proyectos grandes.
- [Eslint](https://eslint.org/): Linter de javascript, para asegurar buenas prácticas.
- [express-validator](https://www.npmjs.com/package/express-validator): Para validaciones de datos.

## Pruebas

La mayoría de las pruebas de la aplicacion van a ser **pruebas unitarias**. Todo se desarrollará bajo el framework [jest](https://jestjs.io/). No se debe mockear la base de datos de pruebas bajo ningún concepto.

Las pruebas se deben hacer llamando directamente a los endpoints, pues así logramos cubrir la mayor porción de código posible y de este modo tener un buen coverage final.

## Contribuir

Debes sencillamente montar un PR al proyecto añadiendo como reviewers a:

- @german1608
- @aitorres

## Reusabilidad

La idea es que este back-end se reuse en los siguientes compushows. Sin embargo, lo mejor sería tener un branch separado por cada año, así tenemos una gran lista de contribuidores y es más fácil reusar cosas.

## Despliegue

TODO