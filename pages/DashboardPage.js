class DashboardPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        
        // Elementos da Página
        this.welcomeMsg = page.locator('#welcome-msg');
        this.btnIrEcommerce = page.locator("button:has-text('Ir para E-commerce')");
        
        // Mapeamento dos campos do formulário de perfil
        this.nameInput = page.locator('#profile-name');
        this.emailInput = page.locator('#profile-email');
        this.phoneInput = page.locator('#profile-phone');
        this.dobInput = page.locator('#profile-dob');
        this.jobInput = page.locator('#profile-job');
        this.deptSelect = page.locator('#profile-dept');
        this.cityInput = page.locator('#profile-city');
        this.stateInput = page.locator('#profile-state');
        this.btnSaveProfile = page.locator('#btn-save-profile');
    }

    async obterMensagemBoasVindas() {
        return await this.welcomeMsg.innerText();
    }

    /**
     * Preenche o formulário com dados fornecidos (ex: via Massa de Dados / Payload)
     * @param {Object} data 
     */
    async preencherFormularioPerfil(data) {
        await this.nameInput.fill(data.name || '');
        await this.emailInput.fill(data.email || '');
        await this.phoneInput.fill(data.phone || '');
        await this.dobInput.fill(data.dob || '');
        await this.jobInput.fill(data.job || '');
        
        if (data.dept) {
            await this.deptSelect.selectOption(data.dept);
        }
        
        await this.cityInput.fill(data.city || '');
        await this.stateInput.fill(data.state || '');
    }

    /**
     * Preenche o formulário utilizando dados dinâmicos gerados externamente
     * @param {import('@faker-js/faker').Faker} fakerInstancia 
     */
    async preencherFormularioPerfilFake(fakerInstancia) {
        const nomeDinamico = fakerInstancia.person.fullName();
        const emailDinamico = fakerInstancia.internet.email();
        const telefoneDinamico = '119' + fakerInstancia.string.numeric(8);
        const dataNascimento = fakerInstancia.date.birthdate({ min: 18, max: 60, mode: 'age' }).toISOString().split('T')[0];

        await this.preencherFormularioPerfil({
            name: nomeDinamico,
            email: emailDinamico,
            phone: telefoneDinamico,
            dob: dataNascimento,
            job: 'Engenheiro de QA',
            dept: 'qa',
            city: 'Osasco',
            state: 'SP'
        });
    }

    async salvarPerfil() {
        await this.btnSaveProfile.click();
    }

    async irParaEcommerce() {
        await this.btnIrEcommerce.click();
    }
}

module.exports = DashboardPage;