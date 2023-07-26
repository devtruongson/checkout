const BtnSendNotify = document.querySelector('#send-notify');
const InputNotify = document.querySelector('.input-notify-teacher');
const InputSaveID = document.querySelector('#id-meeting-gr');

if (BtnSendNotify) {
    if (InputNotify) {
        BtnSendNotify.onclick = async () => {
            if (!InputNotify.value) {
                alert('Vui lòng nhập nội dung!');
                return;
            }

            const Option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: InputSaveID.value,
                    notify: InputNotify.value,
                }),
            };

            const Res = await fetch('/post-notify', Option);

            const data = await Res.json();

            if (data.errCode === 0) {
                alert('Bạn đã gửi thành công comment!');
                window.location.reload();
            } else {
                alert(data.msg);
            }
        };
    }
}
