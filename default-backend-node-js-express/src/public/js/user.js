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
        return `<div class="px-2 py-4 my-4" style="border:1px solid #ccc;"> 
        <div class="row px-4">
        <a style="text-decoration: none; color: #333;" class="col-4" href="/view-edit-group-user/${item.id}" >
            <div class="py-2 px-1" style="background-color: ${item?.isDone ? `#ee4d2d` : `#ccc`}; border-radius: 3px;">
                <h5>Tên Groups ${item.title}</h5>
                <p>ID Group : ${item.id}</p>
                ${
                    item?.isDone
                        ? ` <p class="text-center">
                       <strong>Đã Làm Song</strong>
                   </p>`
                        : ''
                }
            </div>
        </a>
        </div>
        </div>`;
    });

    DivRender.innerHTML =
        htmlRender.join(' ') +
        `<button
            class="btn btn-primary mt-3 px-4 py-2 ms-3"
            data-bs-toggle="modal"
            data-bs-target="#modal-add-group-teacher"
        >
            Thêm Group
        </button>`;
}
