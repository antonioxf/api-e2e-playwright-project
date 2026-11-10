class DashboardPage {
    constructor(page) {
        this.page = page;
        this.welcomeMsg = '#welcome-msg';
        this.btnIrEcommerce = "button:has-text('Ir para E-commerce')";
        
        // Mapeamento dos 10 campos do formulário
        this.nameInput = '#profile-name';
        this.emailInput = '#profile-email';
        this.phoneInput = '#profile-phone';
        this.dobInput = '#profile-dob';
        this.jobInput = '#profile-job';
        this.deptSelect = '#profile-dept';
        this.cityInput = '#profile-city';
        this.stateInput = '#profile-state';
        this.btnSaveProfile = '#btn-save-profile';
    }

    async obterMensagemBoasVindas() {
        return await this.page.locator(this.welcomeMsg).innerText();
    }

    async preencherFormularioPerfil(data) {
        await this.page.fill(this.nameInput, data.name || '');
        await this.page.fill(this.emailInput, data.email || '');
        await this.page.fill(this.phoneInput, data.phone || '');
        await this.page.fill(this.dobInput, data.dob || '');
        await this.page.fill(this.jobInput, data.job || '');
        if (data.dept) await this.page.selectOption(this.deptSelect, data.dept);
        await this.page.fill(this.cityInput, data.city || '');
        await this.page.fill(this.stateInput, data.state || '');
    }

    async salvarPerfil() {
        await this.page.click(this.btnSaveProfile);
    }

    async irParaEcommerce() {
        await this.page.click(this.btnIrEcommerce);
    }
}

module.exports = DashboardPage;