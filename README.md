# Tienda Online BSALE
Visita la app web -> https://gallant-villani-227bfe.netlify.app/

# Descripcion

La aplicacion cliente esta desarrollada con tecnologias del front-end, utilizando HTML5, 
CSS3 y Vainilla JavaScript. Tambien se utilizó distintos CDN para utilizar las funcionalidades
de Bootstrap 4, FontAwesome y Google Fonts.

Para darle un estilizado a las aplicaciones web que desarrollo en general, incluida esta,
suelo usar un poco de Bootstrap y mezclarlo con css, ya que no me gusta sobrecargar demasiado
los elementos de HTML asignandoles demasiadas clases de bootstrap, solo lo justo y necesario,
siento que tengo mejor control utilizando css puro, aunque siempre dependera del caso o desarrollo
en particular. Ademas me apoye con FontAwesome para agregar iconos y Google Fonts para usar fuentes personalizadas.

La aplicacion web consta de 3 principales secciones, la primera contiene las categorias disponibles de los productos, la segunda 
contiene el buscador de productos, y la tercera es el contenedor donde se muestran los productos con su respectivo
paginador.

Debido a que en este ejercicio, se presento la dificultad de que algunos registros de la base
de datos no tenian su respectiva imagen, tome la desicion de crear una imagen predeterminada 
utilizando Photoshop y asi controlar cuando un producto está con imagen o sin ella 
(la imagen se llama "notfound.jpeg"). Asi mismo utilize una imagen de fondo relacionada a la 
tematica del ejercicio y otra imagen que esta dentro del contenedor de los productos. Opte 
por colocar una imagen con un tamaño similar al que ocupan los productos listados en ese lugar, 
ya que cuando los productos desaparecen y aparecen, la pagina daba una especie de salto que 
no era agradable para el usuario.

# Detalle de secciones y funciones JS

Al ingresar a la app web, se cargan en la seccion de productos, todos los productos de la base
de datos BSALE. En todo el desarrollo se realizaron peticiones http por el metodo GET para
consultar los distintos endpoints disponibles en la api rest desarrollada. Se utilizo "fetch"
para realizar estas peticiones. las funciones encargadas de realizar esto son:

```ruby
fetch('https://restapi-nodejs-msql.herokuapp.com/products/0/8').then(res =>{
      res.json().then(data=>{

          showProducts(data, productsList);

      });
});
```

***showProducts():*** se encarga de mostrar los productos en la seccion correspondiente. Recibe 2 
parametros, el primero es el data set obtenido por la peticion "fetch",  el segundo es el 
contenedor en donde iran los productos.

***showPager():*** se encarga de mostrar un paginador dinamico, que varia segun la cantidad de productos
devueltos por la peticion "fetch". En base a al total de productos obtenidos, se realiza un calculo 
para segmentar los productos en diversas paginas si la cantidad es superior a 8, ya que este fue el numero 
maximo de productos que opte por elegir. Quiero recalcar que en internet existian varios ejemplos de 
paginadores, pero quise crear uno desde 0, ya que era un gran desafio tecnico, almenos para mi, pues nunca
habia desarrollado uno.

***filterByCategories():*** esta funcion se ejecuta al iniciar la aplicacion y queda a la espera de que
el usuario haga click en cualquiera de los botones de categorias. Este evento click ejecuta su respectivo
llamado "fetch" y se apoya en las funciones "showProducts" y "showPager".

***showCategoriesMenu():*** esta funcion se encarga de mostrar un menu responsive para celulares y tablets, 
en donde la seccion de categorias se esconde y se muestra median un menu en la parte superior.

***scrollEffect():*** permite desplazarse a travez de la pagina de forma fluida al hacer click en un elemento "<a>",
indicando hacia donde se dirigira mediante su id. 

***pressSearchEnter():*** esta funciona ejecuta el evento onkeypress del boton buscar por nombre, identificando
cuando el usuario presion "Enter".

***pressPagerArrow():*** esta funcion permite desplazarse por el paginador a travez de sus flechas


## Primera seccion (categorias)
esta seccion permite al usuario filtrar los productos mostrados
segun su id de categoria, el podra elegir entre energetica, pisco, ron, bebida, snack, 
cerveza y vodka. A nivel de codigo, se ejecuta la funcion "filterByCategories" que 
a su vez realiza un llamado via http a la api rest. Tambien se utilizan los metodos.

![image](https://user-images.githubusercontent.com/64926462/115153659-2e9a8c00-a045-11eb-855d-feec1533088e.png)


## Segunda seccion (buscador) 
esta seccion le da la opcion al usuario de buscar un producto por su nombre,
ingresando alguna palabra o letra que se encuentre al princio, final o al medio del nombre del producto
buscado. Para esto se ejecuto la funcion "searchProductsByName" que realiza una peticion "fetch" y 
se apoya en las funciones "showProducts" y "showPager".

![image](https://user-images.githubusercontent.com/64926462/115153671-378b5d80-a045-11eb-833b-c92193166540.png)


## Tercera seccion (productos)
esta seccion muestra los productos tanto al iniciar la aplicacion, como cuando
se realiza un filtrado por categoria o nombre, estos productos tienen forma de tarjeta y muestran la informacion
especifica del producto. Tambien es capaz de identificar cuando un producto tiene o no descuento aplicado.

![image](https://user-images.githubusercontent.com/64926462/115153697-54c02c00-a045-11eb-916a-fa78ac25208b.png)
