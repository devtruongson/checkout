const RenderClass = document.querySelector('.render-class');
const BtnViewCalendar = document.querySelector('#view-lich-teacher');

const user = JSON.parse(localStorage.getItem('users'));

BtnViewCalendar.setAttribute('href', `/manage-calendar/${user.id}`);

if (user) {
    const FormElement = document.querySelector('#form-create-class');
    if (user) {
        FormElement.setAttribute('action', `/create-class?id=${user.id}`);
    }

    fetch(`/get-all-class?id=${user.id}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.errCode === 0) {
                if (res.data.length == 0) {
                    RenderClass.innerHTML = ` 
                        <div class="d-flex justify-content-center align-items-center" style="min-height: 60vh">
                            <div class="text-center">
                                <h2>Bạn chưa có lớp nào hãy thêm lớp ngay bây giờ</h2>
                                <button
                                    class="btn btn-primary mt-3 px-4 py-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-add-group-teacher"
                                >
                                    Thêm lớp
                                </button>
                            </div>
                        </div>`;
                } else {
                    // Biến đổi dữ liệu
                    const transformedData = res.data.reduce((result, item) => {
                        const existingItem = result.find((resultItem) => resultItem.title === item.title);
                        if (existingItem) {
                            existingItem.group += `,${item.group}`;
                            existingItem.DataGroup.push(...item.DataGroup);
                        } else {
                            result.push(item);
                        }

                        return result;
                    }, []);
                    Render(transformedData);
                }
            } else {
                alert(res.msg);
            }
        });
}

function Render(data) {
    const htmlRender = data.map((item) => {
        let dataTitle = `
            <div>
                <h4 class="py-2 ps-3">Tên lớp :${item.title}</h4>
            </div>
            `;
        let DataGroup = item.DataGroup.map(
            (itemChildren) => `
            <a style="text-decoration: none; color: #333;" class="col-4" href="/view-end-edit-group/${
                itemChildren.id
            }" >
                <div class="py-2 px-1" style="background-color: ${
                    itemChildren?.isDone ? `#ee4d2d` : `#ccc`
                }; border-radius: 3px;">
                    <h5>Tên Groups ${itemChildren.title}</h5>
                    <p>ID Group : ${itemChildren.id}</p>
                    ${
                        itemChildren?.isDone
                            ? ` <p class="text-center">
                           <strong>Đã Làm Song</strong>
                       </p>`
                            : ''
                    }
                </div>
            </a>
           `,
        );
        return `<div class="px-2 py-4 my-4" style="border:1px solid #ccc;">${dataTitle} 
        <div class="row px-4">
            ${DataGroup}
        </div>
        </div>`;
    });

    RenderClass.innerHTML =
        htmlRender.join(' ') +
        `<button
            class="btn btn-primary mt-3 px-4 py-2 ms-3"
            data-bs-toggle="modal"
            data-bs-target="#modal-add-group-teacher"
        >
            Thêm lớp
        </button>`;
}
