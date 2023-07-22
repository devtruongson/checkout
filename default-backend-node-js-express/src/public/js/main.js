const BtnLogOut = document.querySelector('#logout');

BtnLogOut.onclick = () => {
    const check = confirm('Bạn chắc chắn đăng xuất chứ?');
    if (check) {
        window.location.href = 'http://localhost:8080/get-login';
        localStorage.clear();
    }
};
