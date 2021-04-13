window.addEventListener('load', () =>{

    const productsList = document.querySelector('#products');

    try {
        //get all products when starting app
        //https://restapi-nodejs-msql.herokuapp.com
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

//Variable global
let num = 1


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

        
        if(url_image == "" || url_image == null){
            html += `
                <img src="img/notfound.jpeg" alt="">`
        }
        else{
            html += `
                <img src="${url_image}" alt="">`
        }

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
            num = 1;
            let id = categoriesButtons[i].getAttribute("id");
            const productsList = document.querySelector('#products');
            
            //delete previous product set
            while (products.firstChild) {
                products.removeChild(products.firstChild);
            }
      
            try {
                //get all products by category, passing the id and the limit of products to show
                fetch(`https://restapi-nodejs-msql.herokuapp.com/products_bycategory/${id}/0/8`)
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
        
                showPager(`https://restapi-nodejs-msql.herokuapp.com/products_bycategory/${id}`);

            } catch (error) {

                alert("Ha ocurrido un error al cargar los productos : ", error);
            }     
        });
    }

    
}

//function that allows you to search products by name
function searchProductsByName(){

    //delete previous products
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }

    try {   
        const productList = document.querySelector('#products');      
        const input = document.querySelector('#search').value;

        //if the input is empty, all products will be shown
        if(input === ""){
            fetch(`https://restapi-nodejs-msql.herokuapp.com/products/0/8`).then(res =>{
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
            fetch(`https://restapi-nodejs-msql.herokuapp.com/products_byname/${input}/0/8`).then(res =>{
                res.json().then(data=>{
                    showProducts(data, productList);

                    //add animation to products
                    for (let i = 0; i < productList.childNodes.length; i++) {
                        const element = productList.childNodes[i].classList.add("swing-in-top-fwd");               
                    }
                });
            });

            showPager(`https://restapi-nodejs-msql.herokuapp.com/products_byname/${input}`);
        } 

    } catch (error) {

        alert("Ha ocurrido un error al cargar los productos : ", error);
    }
}

//function that shows a pager that dynamically changes according to the number of products
function showPager(url){

    //delete previous pagination
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    try {
        
        //get all products to calculate how many pages there should be
        fetch(url).then(res =>{
            res.json().then(data=>{
                
                //the limit of products per page is 8
                let numberPages = Math.round(data.length / 8);
                const newPagination = document.querySelector('.pagination');

                newPagination.innerHTML += `
                    <li id="prev"><a href="#pag" ><i class="fas fa-caret-left"></i></a></li>`;
                
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
                    `<li class="pages"><a href="#pag" id='{"num1":${init}, "num2":8}'>${cont}</a></li>`;
                    
                    init = limit;               
                    limit += 8;
                }     

                newPagination.innerHTML +=
                    `<li id="next"><a href="#pag"><i class="fas fa-caret-right"></i></a></li>`;
                
                
                //add to each button within the pager the functionality of displaying the products
                const pages = document.querySelectorAll('.pages');
            
                //listening by click on pager arrows
                document.querySelector('#next').addEventListener('click', ()=>{
                    if(num < pages.length){                      
                        //set global variable
                        num+=1;
                        pressPagerArrow(pages, num, url);                       
                    }                    
                });

                document.querySelector('#prev').addEventListener('click', ()=>{
                    if(num > 1){                        
                        //set global variable
                        num-=1;
                        pressPagerArrow(pages, num, url);                       
                    }                
                });

                //listening by click on pager numbers
                for (let i = 0; i < pages.length; i++) {
                    pages[i].addEventListener('click', ()=>{
                        //set global variable
                        num = i+1
                        //add select effect
                        for (let j = 0; j < pages.length; j++) {
                            pages[j].classList.remove('selected');      
                        }          
                        pages[i].classList.add('selected');
                        //------------------

                        let values = "";
                        values = pages[i].firstChild.getAttribute('id');

                        var json = JSON.parse(values);
                        const listaProductos = document.querySelector('#products');

                        //Delete previusly products
                        while (products.firstChild) {
                            products.removeChild(products.firstChild);
                        }

                        try {
                            //get products by category with limit of pages
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

//function that detects when the enter key is pressed in the search input 
function pressSearchEnter(e){
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13){
        searchProductsByName();
    }   
}

//function that show a menu responsive
function showCategoriesMenu(){
    
    const menuButton = document.querySelector('.btn-mostrar-cat');

    menuButton.addEventListener("click", (e)=>{
        e.preventDefault();
        
        const categoriesButtons = document.querySelector('#btn-categories');
        categoriesButtons.classList.toggle('esconder');
    });
}

function pressPagerArrow(pages, num, url){
    let id = `{"num1":${num*8-8}, "num2":8}`

    for (let j = 0; j < pages.length; j++) {
        pages[j].classList.remove('selected');      
    } 

    let result = document.getElementById(id);
    result.parentNode.classList.add('selected');
    

    //PRUEBA
    var json = JSON.parse(id);
    const listaProductos = document.querySelector('#products');

    //Delete previusly products
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }

    try {
        //get products by category with limit of pages
        fetch(`${url}/${json['num1']}/${json['num2']}`).then(res =>{
            res.json().then(data=>{
                showProducts(data, listaProductos);
            });
        }); 
    } catch (error) {
        alert("Ha ocurrido un error al cargar los productos : ", error);
    } 
}