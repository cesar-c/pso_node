function paginate(event){
    event.preventDefault();
    let url = event.target.href;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('ok');
            const tbody = document.getElementById('table-tbody');
            tbody.innerHTML = "";
            let tb = "";
            for(const {id,name,u_name,u_symbol,description,img} of data.products){
                tb += `
                <tr>
                    <td>${name}</td>
                    <td><img class="table-img" src="/img/products/${img}"></td>
                    <td>${u_name} - ${u_symbol}</td>
                    <td>${description}</td>
                    <td>
                        <a href="/products/edit/${id}" class="btn btn-warning"><i class="fa fa-pencil"></i></a>
                        <a href="/products/delete/${id}" class="btn btn-danger"><i class="fa fa-trash" ></i></a>
                    </td>
                </tr>   
                `
            }
            tbody.innerHTML = tb;
        });
}