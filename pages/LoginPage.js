class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = '#username';
        this.passwordInput = '#password';
        this.loginButton = '#btn-login';
    }

    async preencherLogin(usuario, senha) {
        if (usuario) await this.page.fill(this.usernameInput, usuario);
        if (senha) await this.page.fill(this.passwordInput, senha);
    }

    async clicarEmEntrar() {
        await this.page.click(this.loginButton);
    }
}

module.exports = LoginPage;