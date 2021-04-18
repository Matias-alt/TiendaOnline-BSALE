window.addEventListener('load', () =>{

    const productsList = document.querySelector('#products');

    try {
        /*
        Al iniciar la app, se ejecutara un llamado a la api rest, mediante la funcion fetch.
        Este mostrara todos los productos en el contenedor de productos, pero con un limitador
        definido, en este caso, se mostraran un maximo de 8 productos por pagina
        */


        fetch('https://restapi-nodejs-msql.herokuapp.com/products/0/8').then(res =>{
            res.json().then(data=>{

                showProducts(data, productsList);

            });
        });

        scrollEffect();
        filterByCategories();
        showCategoriesMenu();
        showPager('https://restapi-nodejs-msql.herokuapp.com/products');

      } catch (error) {

        alert("Ha ocurrido un error al cargar los productos : ", error);
      }
})

/*
 ===================
 | VARIABLE GLOBAL |
 ===================

  esta variable cumplira la funcion de recorrer las paginas del paginador 
  al hacer click en las flechas de "atras" y "siguiente".
*/
let num = 1


/*
Funcion que permite dirigirte a distintas
secciones de forma fluida, haciendo click en enlaces <a> 
*/
function scrollEffect(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
    
            document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
            });
        });
    });
}

/*
Funcion que se encarga de mostrar los productos en la seccion correspondiente. 
Recibe 2 parametros, el primero es el data set obtenido por la peticion "fetch", 
el segundo es el contenedor en donde iran los productos
*/
function showProducts(data, productsList){
    //El parametro "data" corresponde al data set que devuelve la funcion "fetch"
    //El parametro "productList" corresponde al elemento html

    for (let i=0; i < data.length; i++) {

        //variable que servira de contenedor para el codigo html del producto
        let product = document.createElement('div');
        let html;

        //Guardar la información del data set json en variables
        let category = data[i]["category"];
        let name = data[i]["name"];
        let price = data[i]["price"];
        let url_image = data[i]["url_image"];
        let discount = data[i]["discount"];
           
        //Aqui se evalua si la variable "category" corresponde a un numero entre 1 y 7
        switch (category) {
            case 1:
              category = "ENERGETICA"
              break;
            case 2:
                category = 'PISCO'
              break;
            case 3:
                category = 'RON'
              break;
            case 4:
                category = 'BEBIDA'
              break;
            case 5:
                category = 'SNACK'
              break;
            case 6:
                category = 'CERVEZA'
              break;
            case 7:
                category = 'VODKA'
              break;   
        }

        /*Si la variable "discount" es distinto a 0, el icono de descuento se mostrara en la parte
        superior derecha, de lo contrario, no se mostrara, ya que no existiria un precio de dcto asociado al producto*/
        
        if(!discount == 0){

            //Se comienza a crear la estructura html para mostrar el producto
            html = `
            <div class="product">
                <i class="fas fa-bookmark dcto"></i>
                <p class="porcentaje-dcto">-${discount}%</p>`                   
        }                
        else{
            html = `
            <div class="product">`               
        }

        

        /*Si la variable "url_image" esta vacia o es nula, se le agregara al producto una imagen por defecto, 
        con el fin de que no se muestre vacia. De lo contrario, se mostrara su imagen correspondiente*/

        if(url_image == "" || url_image == null){
            html += `
                <img src="img/notfound.jpeg" alt="">`
        }
        else{
            html += `
                <img src="${url_image}" alt="">`
        }

        //Se agrega el resto de codigo html con las variables "name", "price" y "category"
        html += `
            <div class="desc-product px-1 mt-3 mb-3">
                <div class="cont-p">
                    <p class="w-70">${name}</p>
                </div>
                
                <span class="w-30">$${price}</span>
            </div>

            <div class="px-4 text-center my-2">
                <p class="btn tag-category">${category}</p>
            </div>
        </div>`
        

        //Se agrega el producto al elemento html "productList"
        product.innerHTML = html; 
        productsList.append(product);
       
    }
}

/*
Función que permite filtrar productos por categoría, aqui se seleccionaran todos los botones
de la seccion de categorias, agregandoles un evento click que permitira hacer la busqueda de productos
*/
function filterByCategories(){
    const categoriesButtons = document.querySelectorAll('.btn-categories');
    
    //Agregar evento click
    for (let i = 0; i < categoriesButtons.length; i++) {
        categoriesButtons[i].addEventListener("click", (e) => {

            e.preventDefault();
            
            /* 
            Se setea la variable global "num" para que vuelva a tener el valor "1", 
            en que caso de que esta fue mutando en el flujo de la app
            */
            num = 1;

            //Se obtiene el id del boton para usarlo posteriormente
            let id = categoriesButtons[i].getAttribute("id");
            const productsList = document.querySelector('#products');
            
            /*
            Se eliminan los elementos del contenedor de productos, 
            para darle paso a lo que se mostraran a continuacion
            */
            while (products.firstChild) {
                products.removeChild(products.firstChild);
            }
      
            try {
                /*
                Se utiliza el siguiente endpoint para traer los productos segun la categoria, que se está pasando
                en la variable "id", ademas se agrega un limitador para mostrar un maximo de 8 produdctos por pagina
                */

                fetch(`https://restapi-nodejs-msql.herokuapp.com/products_bycategory/${id}/0/8`)
                    .then((res) =>{            
                        res.json()
                    .then((data)=>{
                        
                        showProducts(data, productsList);

                        //Se agrega una animacion cuando los prodcutos aparecen
                        for (let i = 0; i < productsList.childNodes.length; i++) {
                            const element = productsList.childNodes[i].classList.add("swing-in-top-fwd");                 
                        }             
                    })
                });
                
                //Mostrar paginador de forma dinamica
                showPager(`https://restapi-nodejs-msql.herokuapp.com/products_bycategory/${id}`);

            } catch (error) {

                alert("Ha ocurrido un error al cargar los productos : ", error);
            }     
        });
    }  
}

//Función que permite buscar productos por nombre, Esta se ejecuta al preciona el boton Buscar
function searchProductsByName(){

    /*
    Se eliminan los elementos del contenedor de productos, 
    para darle paso a lo que se mostraran a continuacion*
    */
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }

    try {   

        //Se selecciona el contenedor de productos y el input de la barra de busqueda
        const productList = document.querySelector('#products');      
        const input = document.querySelector('#search').value;

        /*Si el input esta vacio, se mostraran todos los productos, si ningun filtro. De lo contrario
          se mostraran los productos segun la palabra o letra que se encuentra almacenada  en la variable "input"*/
        if(input === ""){
            fetch(`https://restapi-nodejs-msql.herokuapp.com/products/0/8`).then(res =>{
                res.json().then(data=>{
                    console.log(data);
                    showProducts(data, productList);

                    //Se agrega una animacion cuando los prodcutos aparecen
                    for (let i = 0; i < productList.childNodes.length; i++) {
                        const element = productList.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });
        }
        else{
            fetch(`https://restapi-nodejs-msql.herokuapp.com/products_byname/${input}/0/8`).then(res =>{
                res.json().then(data=>{
                    showProducts(data, productList);

                    //Se agrega una animacion cuando los prodcutos aparecen
                    for (let i = 0; i < productList.childNodes.length; i++) {
                        const element = productList.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });

            //Mostrar paginador de forma dinamica
            showPager(`https://restapi-nodejs-msql.herokuapp.com/products_byname/${input}`);
        } 

    } catch (error) {

        alert("Ha ocurrido un error al cargar los productos : ", error);
    }
}

//Función que muestra un buscapersonas que cambia dinámicamente según la cantidad de productos
function showPager(url){

    //Antes de mostrar el nuevo paginador, se evalua si existe un paginador previamente
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    try {
        
        /*Se obtenen todos los productos para calcular cuántas páginas habran. Como en este caso
          opte por mostrar un maximo de 8 productos por pagina, se ejecuta la funcion fetch, pasandole como
          parametro la variable "url". 

          EJEMPLO: si la funcion fetch devuelve un total de 54 productos, se divide por 8 y se aproxima al entero
        */
        fetch(url).then(res =>{
            res.json().then(data=>{
                           
                let numberPages = Math.round(data.length / 8);
                const newPagination = document.querySelector('.pagination');

                //Se comienza a crear la estructura html del paginador
                newPagination.innerHTML += `
                    <li id="prev"><a href="#pag" ><i class="fas fa-caret-left"></i></a></li>`;
                
                //En caso de que el numero de paginas es igual a 0, se mostrara solo una pagina
                if(numberPages === 0){
                    numberPages = 1;
                }


                /*Se define un contador que servira para recorrer el numero de paginas.

                Teniendo en cuenta que los productos a mostrar seran un maximo de 8 por pagina, y suponiendo
                que las paginas a mortrar son 3, (es decir, hay 24 productos en total en esa busqueda).

                en la pagina [1] se mostraran los productos del 0 al 7
                en la pagina [2] se mostraran los productos del 8 al 15
                en la pagina [3] se mostraran los productos del 16 al 24
                */
                let cont = 0;
                let init = 0;
                let limit = 8

                while(cont < numberPages) {
                    cont += 1;

                    newPagination.innerHTML +=
                    `<li class="pages"><a href="#pag" id='{"num1":${init}, "num2":8}'>${cont}</a></li>`;
                    
                    init = limit;               
                    limit += 8;
                }     

                //Se completa el paginador con el codigo html
                newPagination.innerHTML +=
                    `<li id="next"><a href="#pag"><i class="fas fa-caret-right"></i></a></li>`;
                
                
                //------------------------------------------------------------------------------------------------

                /*
                Se le da el evento click a la flecha del paginador "atras" y "siguiente". 

                - Al hacer click en el la flecha "atras", la variable global "num" se resta en 1
                - Al hacer click en el la flecha "siguiente", la variable global "num" se suma en 1
                */
                const pages = document.querySelectorAll('.pages');
            
                document.querySelector('#next').addEventListener('click', ()=>{
                    if(num < pages.length){                            

                        num+=1;

                        //se pasa la variable "url", "num" y "pages" a la funcion
                        pressPagerArrow(pages, num, url);                       
                    }                    
                });

                document.querySelector('#prev').addEventListener('click', ()=>{
                    if(num > 1){                        

                        num-=1;

                        //se pasa la variable "url", "num" y "pages" a la funcion
                        pressPagerArrow(pages, num, url);                       
                    }                
                });

                /*
                Se agrega a cada boton correspondiente a una pagina la 
                funcionalidad de mostrar los productos
                */
                for (let i = 0; i < pages.length; i++) {
                    pages[i].addEventListener('click', ()=>{

                        num = i+1
                        
                        /*
                        Cuando se hace click a un boton del paginador, se le agrega la clase 'selected'
                        */ 
                        for (let j = 0; j < pages.length; j++) {
                            pages[j].classList.remove('selected');      
                        }          
                        pages[i].classList.add('selected');
                        

                        /*
                        Para poder mostrar los productos de una pagina especifica, se procede a obtener el id de 
                        la pagina seleccionada

                        EJEMPLO de id seleccionado: '{"num1":16, "num2":24}'

                        el paginador tendra como id el numero en donde partira la busqueda de productos y su limite
                        */

                        let values = "";
                        values = pages[i].firstChild.getAttribute('id');

                        var json = JSON.parse(values);
                        const listaProductos = document.querySelector('#products');

                        /*
                        Se eliminan los elementos del contenedor de productos, 
                        para darle paso a lo que se mostraran a continuacion*
                        */
                        while (products.firstChild) {
                            products.removeChild(products.firstChild);
                        }

                        try {
                            /*
                            Se hace una peticion fetch para mostrar los productos correspondiente a la
                            pagina seleccionada
                            */
                            fetch(`${url}/${json['num1']}/${json['num2']}`).then(res =>{
                                res.json().then(data=>{
                                    showProducts(data, listaProductos);
                                });
                            }); 
                        } catch (error) {
                            alert("Ha ocurrido un error al cargar los productos : ", error);
                        } 
                    })   
                }     

                
            });
        });

    } catch (error) {      
        alert("Ha ocurrido un error al cargar los productos : ", error);
    }    

    
    
}

//Función que detecta cuando se presiona la tecla enter en la entrada de búsqueda
function pressSearchEnter(e){
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13){
        searchProductsByName();
    }   
}

//Funcion que muestra un menu responsive cuando el ancho de la pantalla es menor a 1000px (tablets y smartphones)
function showCategoriesMenu(){
    
    const menuButton = document.querySelector('.btn-mostrar-cat');

    menuButton.addEventListener("click", (e)=>{
        e.preventDefault();
        
        const categoriesButtons = document.querySelector('#btn-categories');
        categoriesButtons.classList.toggle('esconder');
    });
}


/*
Funcion que muestra los productos correspondientes a una pagina dentro del paginador al precionar
en las flechas "atras" y "siguiente"
*/ 
function pressPagerArrow(pages, num, url){
    let id = `{"num1":${num*8-8}, "num2":8}`

    for (let j = 0; j < pages.length; j++) {
        pages[j].classList.remove('selected');      
    } 

    let result = document.getElementById(id);
    result.parentNode.classList.add('selected');
    
    var json = JSON.parse(id);
    const listaProductos = document.querySelector('#products');

    /*
    Se eliminan los elementos del contenedor de productos, 
    para darle paso a lo que se mostraran a continuacion
    */
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }

    try {

        /*
        Se hace una peticion fetch para mostrar los productos correspondiente 
        a la boton flecha seleccionado
        */
        fetch(`${url}/${json['num1']}/${json['num2']}`).then(res =>{
            res.json().then(data=>{
                showProducts(data, listaProductos);
            });
        }); 
    }catch (error) {
        alert("Ha ocurrido un error al cargar los productos : ", error);
    } 
}