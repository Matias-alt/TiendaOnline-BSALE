window.addEventListener('load', () =>{

    const listaProductos = document.querySelector('#products');
    
    fetch('http://localhost:3000/products').then(res =>{
        res.json().then(data=>{

            mostrarProductos(data, listaProductos);

        });
    });

    filtrarCategorias();
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
                <button class="btn btn-category">${category}</button>
            </div>
        </div>`
        
        product.innerHTML = test; 
        listaProductos.append(product);
       
    }
}

function filtrarCategorias(){
    const botonesCategorias = document.querySelectorAll('.btn-categories');
    
    for (let i = 0; i < botonesCategorias.length; i++) {
        botonesCategorias[i].addEventListener("click", () => {
            
            let id = botonesCategorias[i].getAttribute("id")
            const listaProductos = document.querySelector('#products');
            //borrar elementos anteriores
            while (products.firstChild) {
                products.removeChild(products.firstChild);
            }

            fetch(`http://localhost:3000/products_bycategory/${id}`).then(res =>{
                res.json().then(data=>{

                    mostrarProductos(data, listaProductos);
                })
            })

        });
    }
}