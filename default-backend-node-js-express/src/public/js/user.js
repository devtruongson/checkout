const DivRender = document.querySelector('.render-class-user');

let userData = JSON.parse(localStorage.getItem('users'));

if (userData) {
    fetch(`/get-all-group-assets?id=${userData.id}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.errCode === 0) {
                Render(res.data);
            }
        });
}

function Render(data) {
    const htmlRender = data.map((item) => {
        console.log(item);

        return `<div class="px-2 py-4 my-4" style="border:1px solid #ccc;"> 
        <div class="row px-4">
        <a style="text-decoration: none; color: #333;" class="col-4" href="/view-edit-group-user/${item.id}" >
            <div class="py-2 px-1" style=" border-radius: 3px;">
                <h3>Tên Lớp ${item?.DataGroup ? item?.DataGroup.title : 'Chưa tham gia lớp'}</h3>
                <h5>Tên Groups ${item.title}</h5>
                <p>ID Group : ${item.id}</p>
            </div>
        </a>
        </div>
        </div>`;
    });

    DivRender.innerHTML = htmlRender.join(' ');
}
