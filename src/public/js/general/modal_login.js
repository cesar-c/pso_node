modal_login = {
    modal: null
}


modal_login.render = (next)=>{
    
        const element = document.querySelector('main');
        let hmtl = `
        <div class="modal fade" id="modal_login" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h3>Login</h3>
                    <form id="modal_login_form">
                        <div class="mt-3">
                            <input type="email" name="email" class="form-control" placeholder="email">
                        </div>
                        <div class="mt-3">
                            <input type="password" name="password" class="form-control" placeholder="password">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="modal_login.close()">Close</button>
                <button type="button" class="btn btn-primary"  onclick="modal_login.submit(event,${next})">
                    <span class="d-none spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Entrar
                </button>
                </div>
            </div>
            </div>
        </div>
        `;

        element.insertAdjacentHTML("beforebegin", hmtl);
        const modal = document.querySelector('#modal_login');
        this.modal = new bootstrap.Modal(modal);
        this.modal.show();

};

modal_login.close = () => {
    this.modal.hide();
    document.querySelector('#modal_login').remove();
}


modal_login.submit = (event,next)=>{
    event.target.querySelector('span').classList.remove('d-none');
    event.target.setAttribute("disabled","");
    const form = document.querySelector('#modal_login_form');
    
    fetch('/users/signin',{
        method: 'POST',
        body: new FormData(form)
    }).then(json => json.json())
        .then(
            data => {
                console.log(data);
                if(data.err){
                    form.reset();
                    event.target.querySelector('span').classList.add('d-none');
                    event.target.removeAttribute("disabled");                    
                }else{
                    let res = next();
                    if(!res.err){
                        this.modal.hide();
                        document.querySelector('#modal_login').remove();
                    }
                }

            }
        );

}

