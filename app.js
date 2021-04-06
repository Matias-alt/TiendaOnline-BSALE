window.addEventListener('load', (e) =>{
    e.preventDefault();
    const listaProductos = document.querySelector('#products');
    
    fetch('http://localhost:3000/products/0/8').then(res =>{
        res.json().then(data=>{

            mostrarProductos(data, listaProductos);

        });
    });

    filtrarCategorias();
    buscarCategoriaPorNombre();
    mostrarMenuCategorias();
    paginacion();

})


function mostrarProductos(data, listaProductos){

    for (let i=0; i < data.length; i++) {

        let product = document.createElement('div');
        let test;

        let category = data[i]["category"];
        let name = data[i]["name"];
        let price = data[i]["price"];
        let url_image = data[i]["url_image"];
        let discount = data[i]["discount"];
           
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


        if(!discount == 0){

            test = `
            <div class="product">
                <i class="fas fa-bookmark dcto"></i>
                <p class="porcentaje-dcto">-${discount}%</p>`                   
        }                
        else{
            test = `
            <div class="product">`               
        }


        //PENDIENTE
        if(url_image != "" || url_image != null){
            test += `
                <img src="${url_image}" alt="">`
        }
        else{
            test += `
                <img src="img/misterbig3308256.jpeg" alt="">`
        }

        test += `
            <div class="desc-product px-4 mt-3 mb-3">
                <p class="w-70">${name}</p>
                <span class="w-30">$${price}</span>
            </div>

            <div class="px-4 text-center my-2">
                <p class="btn tag-category">${category}</p>
            </div>
        </div>`
        
        product.innerHTML = test; 
        listaProductos.append(product);
       
    }
}

function filtrarCategorias(){
    const botonesCategorias = document.querySelectorAll('.btn-categories');
    
    for (let i = 0; i < botonesCategorias.length; i++) {
        botonesCategorias[i].addEventListener("click", (e) => {
            e.preventDefault();
            
            let id = botonesCategorias[i].getAttribute("id")
            const listaProductos = document.querySelector('#products');
            //borrar elementos anteriores
            while (products.firstChild) {
                products.removeChild(products.firstChild);
            }

            fetch(`http://localhost:3000/products_bycategory/${id}`).then(res =>{
                 res.json().then(data=>{

                    mostrarProductos(data, listaProductos);

                    for (let i = 0; i < listaProductos.childNodes.length; i++) {
                        const element = listaProductos.childNodes[i].classList.add("swing-in-top-fwd");                 
                    }
                    
                })
            })

        });
    }
}

function buscarCategoriaPorNombre(){
    const input = document.querySelector('#search');
    const listaProductos = document.querySelector('#products');

    input.addEventListener('input', (e)=>{

        let param = e.target.value;

        //borrar elementos anteriores
        while (products.firstChild) {
            products.removeChild(products.firstChild);
        }

        if(param === ""){

            fetch(`http://localhost:3000/products`).then(res =>{
                res.json().then(data=>{
                    console.log(data);
                    mostrarProductos(data, listaProductos);

                    for (let i = 0; i < listaProductos.childNodes.length; i++) {
                        const element = listaProductos.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });

        }
        else{
            fetch(`http://localhost:3000/products_byname/${param}`).then(res =>{
                res.json().then(data=>{
                    console.log(data);
                    mostrarProductos(data, listaProductos);
    
                    for (let i = 0; i < listaProductos.childNodes.length; i++) {
                        const element = listaProductos.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
    
                });
            });
        }
        
    });

}

function mostrarMenuCategorias(){
    
    const btnMenu = document.querySelector('.btn-mostrar-cat');
    console.log(btnMenu);

    btnMenu.addEventListener("click", (e)=>{
        e.preventDefault();
        
        const btnCategories = document.querySelector('#btn-categories');
        btnCategories.classList.toggle('esconder');
    });
}

function paginacion(){
    fetch('http://localhost:3000/products').then(res =>{
        res.json().then(data=>{
            
            let paginas = Math.round(data.length / 8);
            const contPaginador = document.querySelector('.pagination');

            contPaginador.innerHTML += `
                <li class=""><a href="#" ><i class="fas fa-caret-left"></i></a></li>`;

            let cont = 0;
            let init = 0;
            let limit = 8
            while(cont < paginas) {
                cont += 1;

                contPaginador.innerHTML +=
                `<li class="pages"><a href="#" id='{"num1":${init}, "num2":8}'>${cont}</a></li>`;
                  
                init = limit;               
                limit += 8;
            }     

            contPaginador.innerHTML +=
                `<li><a href="#"><i class="fas fa-caret-right"></i></a></li>`;
                    
            const pages = document.querySelectorAll('.pages');

            for (let i = 0; i < pages.length; i++) {
                pages[i].addEventListener('click', ()=>{
                    let values = "";
                    values = pages[i].firstChild.getAttribute('id');

                    var json = JSON.parse(values);
                    const listaProductos = document.querySelector('#products');

                    //borrar elementos anteriores
                    while (products.firstChild) {
                        products.removeChild(products.firstChild);
                    }

                    fetch(`http://localhost:3000/products/${json['num1']}/${json['num2']}`).then(res =>{
                        res.json().then(data=>{
                            console.log(data);
                            mostrarProductos(data, listaProductos);
                        });
                    });
                    
                })
                
            }
            
        });
    });
}

