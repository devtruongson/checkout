const ModalPortID = document.querySelector('#modal-prtoal');

async function handleEditUser(id) {
    let Res = await fetch(`/get-detail-user?id=${id}`);

    let data = await Res.json();

    if (data.errCode != 0) {
        alert(data.msg);
        return;
    }

    let UserData = data.data;

    let Form = `
            <form method="POST" action="/update-user">
                <div class="row">
                    <div class="mb-3 col-6">
                        <label for="firstName" class="form-label">firstName</label>
                        <input type="text" value="${UserData.firstName}" class="form-control" id="firstName" name="firstName" required aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3 col-6">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input type="text" value="${UserData.lastName}" class="form-control" id="lastName" name="lastName" required>
                    </div>
                    <div class="mb-3 col-12">
                        <label for="role" class="form-label">Quyền Người Dùng</label>
                        <select class="form-control" id="role" name="role" required value="${UserData.role}">
                            <option value="R0">Giáo Viên</option>
                            <option value="R1">Sinh Viên</option>
                        </select>
                    </div>
                    <input type="text" hidden name="id" value="${UserData.id}" />
                    <button type="submit" class="btn btn-primary">Lưu Thông Tin</button>
                </div>
            </form>
    `;

    ModalPortID.innerHTML = Form;
}

async function handleDeleteUser(id) {
    let check = confirm('Are you sure you want to delete!');

    if (!check) return;

    const Option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    };

    const Res = await fetch(`/delete-user/${id}`, Option);

    const data = await Res.json();

    if (data.errCode === 0) {
        window.location.reload();
    } else {
        alert(data.msg);
    }
}
