window.addEventListener('load', () =>{
    const productsList = document.querySelector('#products');
    
    //get all products when starting app
    fetch('http://localhost:3000/products/0/8').then(res =>{
        res.json().then(data=>{

            showProducts(data, productsList);

        });
    });

    filterByCategories();
    searchByName();
    showCategoriesMenu();
    showPager('http://localhost:3000/products');

})


//function that shows the products from database
function showProducts(data, productsList){
    //this function receives a data set and node element where the products will go. 

    for (let i=0; i < data.length; i++) {

        let product = document.createElement('div');
        let html;

        //save json object information
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

        //if product discount is equal to 0, the discount icon will not be displayed 
        if(!discount == 0){

            html = `
            <div class="product">
                <i class="fas fa-bookmark dcto"></i>
                <p class="porcentaje-dcto">-${discount}%</p>`                   
        }                
        else{
            html = `
            <div class="product">`               
        }


        //PENDIENTE
        if(url_image != "" || url_image != null){
            html += `
                <img src="${url_image}" alt="">`
        }
        else{
            html += `
                <img src="img/misterbig3308256.jpeg" alt="">`
        }

        html += `
            <div class="desc-product px-4 mt-3 mb-3">
                <p class="w-70">${name}</p>
                <span class="w-30">$${price}</span>
            </div>

            <div class="px-4 text-center my-2">
                <p class="btn tag-category">${category}</p>
            </div>
        </div>`
        
        product.innerHTML = html; 
        productsList.append(product);
       
    }
}

//function that allows you to filter products by category
function filterByCategories(){
    const categoriesButtons = document.querySelectorAll('.btn-categories');
    
    //add event click to all buttons
    for (let i = 0; i < categoriesButtons.length; i++) {
        categoriesButtons[i].addEventListener("click", (e) => {

            e.preventDefault();
            
            let id = categoriesButtons[i].getAttribute("id")
            const productsList = document.querySelector('#products');
            
            //delete previous product set
            while (products.firstChild) {
                products.removeChild(products.firstChild);
            }
      
            //get all products by category, passing the id and the limit of products to show
            fetch(`http://localhost:3000/products_bycategory/${id}/0/8`)
                .then((res) =>{            
                    res.json()
                .then((data)=>{
                    
                    showProducts(data, productsList);

                    //add animation to products
                    for (let i = 0; i < productsList.childNodes.length; i++) {
                        const element = productsList.childNodes[i].classList.add("swing-in-top-fwd");                 
                    }             
                })
            });
           
            showPager(`http://localhost:3000/products_bycategory/${id}`);
        });
    }

    
}

function searchByName(){
    const input = document.querySelector('#search');
    const productList = document.querySelector('#products');

    input.addEventListener('input', (e)=>{

        let param = e.target.value;

        //delete previous products
        while (products.firstChild) {
            products.removeChild(products.firstChild);
        }

        //if the input is empty, all products will be shown
        if(param === ""){
            fetch(`http://localhost:3000/products`).then(res =>{
                res.json().then(data=>{
                    console.log(data);
                    showProducts(data, productList);

                    //add animation to products
                    for (let i = 0; i < productList.childNodes.length; i++) {
                        const element = productList.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });
        }

        //show products by name
        else{
            fetch(`http://localhost:3000/products_byname/${param}`).then(res =>{
                res.json().then(data=>{
                    console.log(data);
                    showProducts(data, productList);
    
                    //add animation to products
                    for (let i = 0; i < productList.childNodes.length; i++) {
                        const element = productList.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });
        }    
    });
}

function showCategoriesMenu(){
    
    const menuButton = document.querySelector('.btn-mostrar-cat');

    menuButton.addEventListener("click", (e)=>{
        e.preventDefault();
        
        const categoriesButtons = document.querySelector('#btn-categories');
        categoriesButtons.classList.toggle('esconder');
    });
}

function showPager(url){

    //delete previous pagination
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    //get all products to calculate how many pages there should be
    fetch(url).then(res =>{
        res.json().then(data=>{
            
            //the limit of products per page is 8
            let numberPages = Math.round(data.length / 8);
            const newPagination = document.querySelector('.pagination');

            newPagination.innerHTML += `
                <li class=""><a href="#" ><i class="fas fa-caret-left"></i></a></li>`;
            
            //condition to show at least 1 page
            if(numberPages === 0){
                numberPages = 1;
            }

            let cont = 0;
            let init = 0;
            let limit = 8
            while(cont < numberPages) {
                cont += 1;

                newPagination.innerHTML +=
                `<li class="pages"><a href="#" id='{"num1":${init}, "num2":8}'>${cont}</a></li>`;
                  
                init = limit;               
                limit += 8;
            }     

            newPagination.innerHTML +=
                `<li><a href="#"><i class="fas fa-caret-right"></i></a></li>`;
            
             
            //add to each button within the pager the functionality of displaying the products
            const pages = document.querySelectorAll('.pages');

            for (let i = 0; i < pages.length; i++) {
                pages[i].addEventListener('click', ()=>{
                    let values = "";
                    values = pages[i].firstChild.getAttribute('id');

                    var json = JSON.parse(values);
                    const listaProductos = document.querySelector('#products');

                    //Delete previusly products
                    while (products.firstChild) {
                        products.removeChild(products.firstChild);
                    }

                    //get products by category with limit of pages
                    fetch(`${url}/${json['num1']}/${json['num2']}`).then(res =>{
                        res.json().then(data=>{
                            showProducts(data, listaProductos);
                        });
                    });  
                })   
            }
            
        });
    });
}