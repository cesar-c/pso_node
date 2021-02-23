const modal_element = document.getElementById('infoModal');

let current_item = null;

const modal_object = new bootstrap.Modal(modal_element, {
    keyboard: false,
    backdrop: 'static'
  });


async function modalProducto (event,id){
    event.preventDefault();
    clr_modal();
    const result = await fetch(`/products/info/${id}`);
    const json = await result.json();
    current_item = json.product[0];
    render_modal(current_item);  

    modal_object.show();
}

function clr_modal(){
  modal_element.querySelector('form').reset();
  modal_element.querySelector('#modal_product_nombre').innerHTML = '';
  modal_element.querySelector('#modal_product_description').innerHTML = '';
  modal_element.querySelector('#modal_form_cantidad').innerHTML = '';
}

function save_solic(event){
  event.preventDefault();
  event.target.querySelector('span').classList.remove('d-none');
  event.target.setAttribute("disabled","");
  let item = current_item;
  item.count = modal_element.querySelector('#modal_form_cantidad').value;
  item.detalle = modal_element.querySelector('#modal_form_detalle').value;
  list_items.add_or_edit_item(item);
  modal_object.hide();
  clr_modal();
  event.target.querySelector('span').classList.add('d-none');
  event.target.removeAttribute("disabled");
  list_items.print_list();
}

function render_modal(item){
  const {   img, 
            tb_producto_esptec,
            tb_producto_nom,
            tb_producto_unimed,
            tb_producto_fictec,
            tb_producto_cod,
            tb_producto_id,
            count,
            detalle} = item;

  modal_element.querySelector('#modal_product_nombre').innerHTML = tb_producto_nom;
  modal_element.querySelector('#modal_product_description').innerHTML = tb_producto_esptec;
  modal_element.querySelector('#modal_form_cantidad').setAttribute('placeholder',tb_producto_unimed);
  modal_element.querySelector('#modal_product_img').setAttribute('src',`/img/products/${img}`);
  modal_element.querySelector('#modal_form_cantidad').value = count;
  (detalle) ? modal_element.querySelector('#modal_form_detalle').value = detalle : null ;
  if(tb_producto_fictec){
    modal_element.querySelector('#modal_product_ficha').classList.remove('d-none');
  }else{
    modal_element.querySelector('#modal_product_ficha').classList.add('d-none');
  }
}

function edit_modal(event,id){
  event.preventDefault();
  current_item =  list_items.find(id);
  render_modal(current_item);
  modal_object.show();
}