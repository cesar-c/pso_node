
const container = document.querySelector('#content_cards');

window.onload = ()=>{
    fetch('/products')
    .then(res => res.json())
    .then( (json) => {
        generate_card(json.products);
    } );
    list_items.load_list();
};


const generate_card = (rows)=>{
    let cads = '';
    container.classList.add('d-none');
    for(const { tb_producto_id , 
                tb_producto_nom,
                img,
                tb_producto_unimed} of rows){

        cads += `
        <div class="col pt-4">
            <article class="card">
                <img src="/img/products/${img}" class="card-img-top" alt='...' >
                <div class="card-body">
                    <p>${tb_producto_nom}</p>
                    <p>Unidad: ${tb_producto_unimed} </p>
                    <a href="#" onclick="modalProducto(event,${tb_producto_id});" class="btn btn-info w-100 stretched-link">Info</a>
                </div>
            </article>
        </div>
        `;
    }
    container.innerHTML = cads;
    container.classList.remove('d-none');

}