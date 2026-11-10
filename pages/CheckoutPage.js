class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.addressInput = '#shipping-address';
        this.cardInput = '#card-number';
        this.btnCheckout = '#btn-checkout';
        this.modalTitle = '#modal-title';
        this.btnModalEntendido = '#custom-modal button'; 
    }

    async adicionarProdutoAoCarrinho(productName) {
        // 1. Clica no botão "Adicionar" do produto escolhido no catálogo de forma dinâmica, indiferente da sequência do elemento na tela
        const productButton = `xpath=//*[contains(text(),'${productName}')]/following::button[1]`;
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