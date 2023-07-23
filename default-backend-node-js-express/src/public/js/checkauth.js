const User = localStorage.getItem('users');

if (!User) {
    window.location.href = 'http://localhost:8080/get-login';
} else {
    if (JSON.parse(User).role === 'R1') {
        window.location.href = '/get-home-user';
    } else {
        window.location.href = '/home';
    }
}
