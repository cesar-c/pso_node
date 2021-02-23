const list_items = {
    data : {
        descrp: '',
        items: []
    }
};

list_items.load_list = function (){
    const result = localStorage.getItem('list_items');
    if(result){
        this.data = JSON.parse(result);
    }
    this.print_list();
}

list_items.remove_item = function (event,id) {
    let i = this.data.items.findIndex(element => element.tb_producto_id === id);
    this.data.items.splice(i,1);
    const item = event.target.parentNode.parentNode;
    item.remove();
    this.save_list();
}

list_items.add_or_edit_item = function (item) {
    let result = this.data.items.findIndex( 
        (element) => element.tb_producto_id === item.tb_producto_id );
    if(result > 0){
        this.data.items[result] = item;
    }else{
        this.data.items.push(item);
    } 

    this.save_list();
}

list_items.save_detalle = function (event) {
    this.data.descrp = event.target.value;
    this.save_list();
}

list_items.save_list = function ()  {
    localStorage.setItem('list_items',JSON.stringify(this.data));
}

list_items.print_list = function () {
    const container = document.querySelector('#list_items_container');
    const textArea = document.querySelector('#detalle_solicitud');
    textArea.value = this.data.descrp;
    let list = "";
    for(const { 
        tb_producto_id , 
        tb_producto_nom,
        img,
        count,
        tb_producto_unimed} of this.data.items){

        list +=  `
        <article class="row mt-2 py-2 border-top border-bottom border-2">
            <div class="col-4">
                <img class="w-100" src="/img/products/${img}" alt="">
            </div>
            <div class="col-6">
                ${tb_producto_nom}
                <br>
                ${tb_producto_unimed} : ${count}
            </div> 
            <div class="col-2">
                <a href="#" onclick="edit_modal(event,${tb_producto_id})" class="btn btn-sm btn-warning"><i class="fa fa-pencil"></i></a>
                <br>
                <a href="#" onclick="list_items.remove_item(event,${tb_producto_id})" class="btn btn-sm btn-danger"><i class="fa fa-trash" ></i></a>
            </div>
        </article>
         `;
    }
    container.innerHTML = list ;
}

list_items.find = function(id){
    return this.data.items.find( element => element.tb_producto_id === id );
}




list_items.submit = function(mlg=false){
    let data = JSON.stringify(list_items.data);

    return fetch('/solid/new',{
        method: 'POST',
        body: data, 
        headers: {'Content-Type': 'application/json'}
        }).then(json => json.json())
        .then(
            data => {
                if(data.err && !mlg){
                    modal_login.render(list_items.submit);
                    return null;
                }
                if(data.err && mlg){
                    return {err: true}

                }
                list_items.data = {
                    descrp: '',
                    items: []
                };
                list_items.save_list();
                list_items.print_list();
                return {err:false}
            }
        );
}