class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.addressInput = '#shipping-address';
        this.cardInput = '#card-number';
        this.btnCheckout = '#btn-checkout';
        this.modalTitle = '#modal-title';
        // Seletor do botão "Entendido" dentro do modal de diálogo
        this.btnModalEntendido = '#custom-modal button'; 
    }

    async adicionarProdutoAoCarrinho(productName) {
        // 1. Clica no botão "Adicionar" do produto escolhido no catálogo
        const productButton = `xpath=//p[text()='${productName}']/ancestor::div[contains(@class, 'flex')]//button`;
        await this.page.click(productButton);

        // 2. Clica no botão "Entendido" do modal que aparece logo em seguida
        await this.page.click(this.btnModalEntendido);
    }

    async preencherCheckout(endereco, cartao) {
        if (endereco) await this.page.fill(this.addressInput, endereco);
        if (cartao) await this.page.fill(this.cardInput, cartao);
    }

    async finalizarCompra() {
        await this.page.click(this.btnCheckout);
    }

    async obterTituloModal() {
        return await this.page.locator(this.modalTitle).innerText();
    }
}

module.exports = CheckoutPage;